from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.orders import router as orders_router
from app.config.settings import settings
from app.utils.logger import logger

app = FastAPI(
    title="Order Service",
    description="Order management and tracking",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(orders_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "order"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,  port=8003)