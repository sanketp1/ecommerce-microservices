from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.payments import router as payments_router
from app.config.settings import settings
from app.utils.logger import logger

app = FastAPI(
    title="Payment Service", 
    description="Payment processing and verification",
    version="1.0.0",
    docs_url="/api/payments/docs",             # Swagger UI
    redoc_url="/api/payments/redoc",           # Redoc UI (optional)
    openapi_url="/api/payments/openapi.json"   # OpenAPI schema
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(payments_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "payment"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)