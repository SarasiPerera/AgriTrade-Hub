from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.order import OrderStatus


class OrderCreate(BaseModel):
    product_id: int
    quantity: float


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    buyer_id: int
    quantity: float
    total_price: float
    status: OrderStatus
    created_at: datetime
    updated_at: datetime | None
