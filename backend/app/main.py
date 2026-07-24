from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import Base, engine
import app.models  # noqa: F401  ensures models are registered on Base before create_all

from app.api.routes import auth, products, orders, admin

app = FastAPI(title="AgriTrade Hub API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # For production, prefer Alembic migrations instead of create_all.
    Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
