from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from app.api.routes.admin import router as admin_router
from app.config.settings import settings
from app.utils.logger import logger
import logging

logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Admin Service",
        description="Administration dashboard and management",
        version="1.0.0",
        docs_url="/api/admin/docs",             # Swagger UI
        redoc_url="/api/admin/redoc",           # Redoc UI (optional)
        openapi_url="/api/admin/openapi.json"   # OpenAPI schema
    )
    
    logger.info(settings.allowed_origins)
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(admin_router, prefix="/api")

    # Health check endpoint
    @app.get("/api/health")
    async def health_check():
        return {"status": "healthy", "service": "admin"}

    logger.info("Admin service initialized successfully")
    return app

app = create_app()




@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
    # Ensure CORS headers are included even on error
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)