from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings, openapi_tags
from app.api.v1 import auth as auth_api
from app.api.v1 import admin as admin_api
from app.api.v1 import hr as hr_api
from app.api.v1 import candidate as candidate_api
from app.api.v1 import chat as chat_api
from app.api.v1 import health as health_api
from app.api.v1 import files as files_api
from app.api.v1 import email as email_api
from app.api.v1 import events as events_api
from app.ws import router as ws_router

# PUBLIC_INTERFACE
def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Returns:
        FastAPI: Configured FastAPI app instance with CORS, routes, and metadata.
    """
    app = FastAPI(
        title="Online Assessment Platform API",
        description="REST and WebSocket backend for the Online Assessment and Interview Platform.",
        version="0.1.0",
        openapi_tags=openapi_tags,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in settings.APP_CORS_ORIGINS.split(",") if origin.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(health_api.router, prefix="/health", tags=["Health"])
    app.include_router(auth_api.router, prefix="/auth", tags=["Auth"])
    app.include_router(admin_api.router, prefix="/admin", tags=["Admin"])
    app.include_router(hr_api.router, prefix="/hr", tags=["HR"])
    app.include_router(candidate_api.router, prefix="/candidate", tags=["Candidate"])
    app.include_router(chat_api.router, prefix="/chat", tags=["Chat"])
    app.include_router(events_api.router, prefix="/events", tags=["Events"])
    app.include_router(files_api.router, prefix="/files", tags=["Files"])
    app.include_router(email_api.router, prefix="/email", tags=["Email"])
    # WebSocket routes
    app.include_router(ws_router.router, tags=["WebSocket"])

    @app.get(
        "/docs/websocket-usage",
        summary="WebSocket usage help",
        description="Describes how to connect to WebSocket endpoints, query params and auth.",
        tags=["WebSocket"],
        operation_id="websocket_usage_help",
    )
    def websocket_usage_help():
        return {
            "endpoints": [
                {"path": "/ws/chat", "params": ["room", "token"], "notes": "Chat room broadcast"},
                {"path": "/ws/hr/live", "params": ["token"], "notes": "HR live monitor stream"},
            ],
            "auth": "Pass JWT as token query param; in current stub only signature is validated.",
        }

    return app


app = create_app()
