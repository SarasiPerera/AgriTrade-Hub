from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.product import ProductGrade, ProductStatus


class ProductCreate(BaseModel):
    crop: str
    variety: str | None = None
    harvest_date: date
    quantity: float
    unit: str = "kg"
    grade: ProductGrade = ProductGrade.B
    organic: bool = False
    district: str
    estimated_delivery_date: date | None = None
    price_per_unit: float
    images: list[str] = []
    export_quality: bool = False


class ProductUpdate(BaseModel):
    quantity: float | None = None
    price_per_unit: float | None = None
    status: ProductStatus | None = None


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    farmer_id: int
    crop: str
    variety: str | None
    harvest_date: date
    quantity: float
    unit: str
    grade: ProductGrade
    organic: bool
    district: str
    estimated_delivery_date: date | None
    price_per_unit: float
    images: list[str]
    export_quality: bool
    status: ProductStatus
    created_at: datetime


class ProductFilter(BaseModel):
    district: str | None = None
    crop: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    organic: bool | None = None
    export_quality: bool | None = None
