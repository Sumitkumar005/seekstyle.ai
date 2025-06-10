from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import uvicorn
import os
from typing import List, Optional, Dict, Any
import logging
from contextlib import asynccontextmanager

# Import all route modules
from routes import search_routes, product_routes, user_routes, moodboard_routes, analytics_routes, feedback_routes, ai_routes
from services.database_service import DatabaseService
from services.vector_service import VectorService
from services.cache_service import CacheService
from middleware.auth_middleware import AuthMiddleware
from middleware.rate_limit_middleware import RateLimitMiddleware
from utils.logger import setup_logger

# Setup logging
logger = setup_logger(__name__)

# Initialize services
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting SeekStyle.ai API server...")
    
    # Initialize database
    db_service = DatabaseService()
    await db_service.initialize()
    
    # Initialize vector database
    vector_service = VectorService()
    await vector_service.initialize()
    
    # Initialize cache
    cache_service = CacheService()
    await cache_service.initialize()
    
    logger.info("All services initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down services...")
    await db_service.close()
    await vector_service.close()
    await cache_service.close()

# Create FastAPI app
app = FastAPI(
    title="SeekStyle.ai API",
    description="The Future of Fashion Discovery - AI-Powered Fashion Search Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
app.add_middleware(RateLimitMiddleware)

# Security
security = HTTPBearer()

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SeekStyle.ai API",
        "version": "1.0.0"
    }

# Include all route modules
app.include_router(search_routes.router, prefix="/api/search", tags=["Search"])
app.include_router(product_routes.router, prefix="/api/products", tags=["Products"])
app.include_router(user_routes.router, prefix="/api/user", tags=["User"])
app.include_router(moodboard_routes.router, prefix="/api/moodboard", tags=["Moodboard"])
app.include_router(analytics_routes.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(feedback_routes.router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI Assistant"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
