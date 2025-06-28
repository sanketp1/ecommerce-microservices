from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.api.routes import auth, users, admin
from app.database.connection import init_database
from app.utils.logger import setup_logging
import logging

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Auth Service",
        description="Authentication and user management",
        version="1.0.0",
        docs_url="/api/auth/docs",             # Swagger UI
        redoc_url="/api/auth/redoc",           # Redoc UI (optional)
        openapi_url="/api/auth/openapi.json"   # OpenAPI schema

    )

    # Setup logging
    setup_logging()
        
    logger.info(settings.allowed_origins)
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(users.router, prefix="/api/users", tags=["users"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

    @app.on_event("startup")
    async def startup_event():
        await init_database()

    @app.get("/api/health")
    async def health_check():
        return {"status": "healthy", "service": "auth"}

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
