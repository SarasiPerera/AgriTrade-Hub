from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.database import get_db
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User, UserRole
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderOut, status_code=201)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.wholesale, UserRole.export)),
):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if payload.quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")

    order = Order(
        product_id=product.id,
        buyer_id=current_user.id,
        quantity=payload.quantity,
        total_price=payload.quantity * product.price_per_unit,
        status=OrderStatus.pending,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/mine", response_model=list[OrderOut])
def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.wholesale, UserRole.export)),
):
    return db.query(Order).filter(Order.buyer_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/incoming", response_model=list[OrderOut])
def incoming_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer)),
):
    """Orders placed against this farmer's products."""
    return (
        db.query(Order)
        .join(Product, Order.product_id == Product.id)
        .filter(Product.farmer_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer)),
):
    """Farmer accepts or rejects an order on their product."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if product.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your order to manage")

    order.status = payload.status
    if payload.status == OrderStatus.accepted:
        product.quantity -= order.quantity
        if product.quantity <= 0:
            from app.models.product import ProductStatus
            product.status = ProductStatus.sold_out

    db.commit()
    db.refresh(order)
    return order
