import enum

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Enum, func, JSON
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class ProductGrade(str, enum.Enum):
    A = "A"
    B = "B"
    C = "C"


class ProductStatus(str, enum.Enum):
    pending = "pending"       # awaiting admin approval
    approved = "approved"
    rejected = "rejected"
    sold_out = "sold_out"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    crop = Column(String, nullable=False)
    variety = Column(String, nullable=True)
    harvest_date = Column(Date, nullable=False)
    quantity = Column(Float, nullable=False)      # remaining available quantity
    unit = Column(String, default="kg")
    grade = Column(Enum(ProductGrade), default=ProductGrade.B)
    organic = Column(Boolean, default=False)
    district = Column(String, nullable=False)
    estimated_delivery_date = Column(Date, nullable=True)
    price_per_unit = Column(Float, nullable=False)
    images = Column(JSON, default=list)           # list of image URLs
    export_quality = Column(Boolean, default=False)
    status = Column(Enum(ProductStatus), default=ProductStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    farmer = relationship("User", back_populates="products")
    orders = relationship("Order", back_populates="product", cascade="all, delete-orphan")
