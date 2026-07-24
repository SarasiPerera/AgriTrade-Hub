from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.database import get_db
from app.models.product import Product, ProductStatus
from app.models.user import User, UserRole
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut

router = APIRouter(prefix="/api/products", tags=["products"])


@router.post("", response_model=ProductOut, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer)),
):
    product = Product(farmer_id=current_user.id, **payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("", response_model=list[ProductOut])
def list_products(
    db: Session = Depends(get_db),
    district: str | None = Query(None),
    crop: str | None = Query(None),
    min_price: float | None = Query(None),
    max_price: float | None = Query(None),
    organic: bool | None = Query(None),
    export_quality: bool | None = Query(None),
    only_approved: bool = Query(True),
):
    """Search/filter marketplace products - used by wholesale & export buyers."""
    q = db.query(Product)
    if only_approved:
        q = q.filter(Product.status == ProductStatus.approved)
    if district:
        q = q.filter(Product.district.ilike(f"%{district}%"))
    if crop:
        q = q.filter(Product.crop.ilike(f"%{crop}%"))
    if min_price is not None:
        q = q.filter(Product.price_per_unit >= min_price)
    if max_price is not None:
        q = q.filter(Product.price_per_unit <= max_price)
    if organic is not None:
        q = q.filter(Product.organic == organic)
    if export_quality is not None:
        q = q.filter(Product.export_quality == export_quality)
    return q.order_by(Product.created_at.desc()).all()


@router.get("/match")
def smart_match(
    crop: str = Query(...),
    quantity: float = Query(...),
    district: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """
    Simple smart-matching: given a buyer request like
    "need 800kg of carrots" (+ optional district preference),
    rank approved products by how well they satisfy the request.
    """
    q = db.query(Product).filter(
        Product.status == ProductStatus.approved,
        Product.crop.ilike(f"%{crop}%"),
    )
    candidates = q.all()

    def score(p: Product) -> float:
        s = 0.0
        s += min(p.quantity / quantity, 1.5) * 2       # can it fulfill the quantity?
        if district and p.district.lower() == district.lower():
            s += 1.5                                    # same-district bonus (lower delivery cost)
        s += 1.0 if p.grade.value == "A" else 0.5
        return s

    ranked = sorted(candidates, key=score, reverse=True)
    return [ProductOut.model_validate(p) for p in ranked[:20]]


@router.get("/mine", response_model=list[ProductOut])
def my_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer)),
):
    return db.query(Product).filter(Product.farmer_id == current_user.id).order_by(Product.created_at.desc()).all()


@router.patch("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer)),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your product")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.farmer)),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your product")
    db.delete(product)
    db.commit()
