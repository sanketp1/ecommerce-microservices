from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.connection import initialize_database
from app.api.routes.products import router as products_router
from app.utils.logger import logger
import logging

logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        description=settings.app_description,
        version=settings.app_version,
        docs_url="/api/products/docs",             # Swagger UI
        redoc_url="/api/products/redoc",           # Redoc UI (optional)
        openapi_url="/api/products/openapi.json"   # OpenAPI schema
    )

    
    logger.info(settings.allowed_origins)
    print(settings.allowed_origins)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(products_router, prefix="/api")

    @app.on_event("startup")
    async def startup_event():
        """Initialize database and sample data on startup."""
        await initialize_database()
        logger.info("Application started successfully")

    @app.get("/api/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "service": "product"}

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=settings.port)