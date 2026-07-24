from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.database import get_db
from app.models.order import Order, OrderStatus
from app.models.product import Product, ProductStatus
from app.models.user import User, UserRole
from app.schemas.product import ProductOut
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_role(UserRole.admin))])


@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}/verify", response_model=UserOut)
def verify_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user


@router.get("/products/pending", response_model=list[ProductOut])
def pending_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.status == ProductStatus.pending).all()


@router.patch("/products/{product_id}/approve", response_model=ProductOut)
def approve_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.status = ProductStatus.approved
    db.commit()
    db.refresh(product)
    return product


@router.patch("/products/{product_id}/reject", response_model=ProductOut)
def reject_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.status = ProductStatus.rejected
    db.commit()
    db.refresh(product)
    return product


@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    total_farmers = db.query(func.count(User.id)).filter(User.role == UserRole.farmer).scalar()
    total_buyers = db.query(func.count(User.id)).filter(
        User.role.in_([UserRole.wholesale, UserRole.export])
    ).scalar()
    total_products = db.query(func.count(Product.id)).scalar()
    active_orders = db.query(func.count(Order.id)).filter(
        Order.status.in_([OrderStatus.pending, OrderStatus.accepted])
    ).scalar()
    revenue = db.query(func.coalesce(func.sum(Order.total_price), 0.0)).filter(
        Order.status == OrderStatus.accepted
    ).scalar()
    top_crops = (
        db.query(Product.crop, func.count(Product.id).label("count"))
        .group_by(Product.crop)
        .order_by(func.count(Product.id).desc())
        .limit(5)
        .all()
    )

    return {
        "total_farmers": total_farmers,
        "total_buyers": total_buyers,
        "total_products": total_products,
        "active_orders": active_orders,
        "revenue": revenue,
        "popular_crops": [{"crop": c, "count": n} for c, n in top_crops],
    }
