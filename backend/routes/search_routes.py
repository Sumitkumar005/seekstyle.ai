from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
from services.search_service import SearchService
from services.vector_service import VectorService
from services.cache_service import CacheService
from middleware.auth_middleware import get_current_user_optional
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

# Pydantic models
class TextSearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    limit: int = 20

class ImageSearchRequest(BaseModel):
    images: List[str]  # Base64 encoded images
    filters: Optional[Dict[str, Any]] = None
    limit: int = 20

class CombinedSearchRequest(BaseModel):
    text: Optional[str] = None
    images: Optional[List[str]] = None
    pinterest_url: Optional[str] = None
    mode: str = "combined"
    filters: Optional[Dict[str, Any]] = None
    limit: int = 20

class SearchResponse(BaseModel):
    products: List[Dict[str, Any]]
    total_count: int
    search_time: float
    query_embedding: Optional[List[float]] = None

# Initialize services
search_service = SearchService()
vector_service = VectorService()
cache_service = CacheService()

@router.post("/text", response_model=SearchResponse)
async def text_search(
    request: TextSearchRequest,
    background_tasks: BackgroundTasks,
    user = Depends(get_current_user_optional)
):
    """
    Search products using text query
    
    - **query**: Text description of desired style/product
    - **filters**: Optional filters (price, brand, category, etc.)
    - **limit**: Maximum number of results to return
    """
    try:
        logger.info(f"Text search request: {request.query}")
        
        # Check cache first
        cache_key = f"text_search:{hash(request.query)}:{hash(str(request.filters))}"
        cached_result = await cache_service.get(cache_key)
        
        if cached_result:
            logger.info("Returning cached search results")
            return cached_result
        
        # Perform search
        results = await search_service.text_search(
            query=request.query,
            filters=request.filters,
            limit=request.limit,
            user_id=user.get("id") if user else None
        )
        
        # Cache results
        await cache_service.set(cache_key, results, ttl=3600)  # 1 hour
        
        # Track search event in background
        if user:
            background_tasks.add_task(
                search_service.track_search_event,
                user_id=user["id"],
                query=request.query,
                search_type="text",
                result_count=len(results["products"])
            )
        
        return results
        
    except Exception as e:
        logger.error(f"Text search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")

@router.post("/image", response_model=SearchResponse)
async def image_search(
    request: ImageSearchRequest,
    background_tasks: BackgroundTasks,
    user = Depends(get_current_user_optional)
):
    """
    Search products using image similarity
    
    - **images**: List of base64 encoded images
    - **filters**: Optional filters
    - **limit**: Maximum number of results
    """
    try:
        logger.info(f"Image search request with {len(request.images)} images")
        
        # Generate cache key from image hashes
        image_hashes = [hash(img) for img in request.images]
        cache_key = f"image_search:{hash(str(image_hashes))}:{hash(str(request.filters))}"
        cached_result = await cache_service.get(cache_key)
        
        if cached_result:
            return cached_result
        
        # Perform image search
        results = await search_service.image_search(
            images=request.images,
            filters=request.filters,
            limit=request.limit,
            user_id=user.get("id") if user else None
        )
        
        # Cache results
        await cache_service.set(cache_key, results, ttl=3600)
        
        # Track search event
        if user:
            background_tasks.add_task(
                search_service.track_search_event,
                user_id=user["id"],
                query="image_search",
                search_type="image",
                result_count=len(results["products"])
            )
        
        return results
        
    except Exception as e:
        logger.error(f"Image search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Image search failed")

@router.post("/combined", response_model=SearchResponse)
async def combined_search(
    request: CombinedSearchRequest,
    background_tasks: BackgroundTasks,
    user = Depends(get_current_user_optional)
):
    """
    Advanced multimodal search combining text, images, and Pinterest URLs
    
    - **text**: Optional text query
    - **images**: Optional list of images
    - **pinterest_url**: Optional Pinterest URL to analyze
    - **mode**: Search mode (text, image, pinterest, combined)
    - **filters**: Optional filters
    - **limit**: Maximum results
    """
    try:
        logger.info(f"Combined search: mode={request.mode}")
        
        # Validate input
        if not any([request.text, request.images, request.pinterest_url]):
            raise HTTPException(
                status_code=400, 
                detail="At least one search input (text, images, or Pinterest URL) is required"
            )
        
        # Generate cache key
        cache_components = [
            request.text or "",
            str(request.images) if request.images else "",
            request.pinterest_url or "",
            request.mode,
            str(request.filters)
        ]
        cache_key = f"combined_search:{hash('|'.join(cache_components))}"
        cached_result = await cache_service.get(cache_key)
        
        if cached_result:
            return cached_result
        
        # Perform combined search
        results = await search_service.combined_search(
            text=request.text,
            images=request.images,
            pinterest_url=request.pinterest_url,
            mode=request.mode,
            filters=request.filters,
            limit=request.limit,
            user_id=user.get("id") if user else None
        )
        
        # Cache results
        await cache_service.set(cache_key, results, ttl=3600)
        
        # Track search event
        if user:
            background_tasks.add_task(
                search_service.track_search_event,
                user_id=user["id"],
                query=request.text or "multimodal_search",
                search_type="combined",
                result_count=len(results["products"])
            )
        
        return results
        
    except Exception as e:
        logger.error(f"Combined search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Combined search failed")

@router.get("/similar/{product_id}", response_model=SearchResponse)
async def get_similar_products(
    product_id: str,
    limit: int = 20,
    user = Depends(get_current_user_optional)
):
    """
    Find products similar to a given product
    
    - **product_id**: ID of the reference product
    - **limit**: Maximum number of similar products to return
    """
    try:
        logger.info(f"Similar products search for: {product_id}")
        
        cache_key = f"similar:{product_id}:{limit}"
        cached_result = await cache_service.get(cache_key)
        
        if cached_result:
            return cached_result
        
        results = await search_service.get_similar_products(
            product_id=product_id,
            limit=limit,
            user_id=user.get("id") if user else None
        )
        
        await cache_service.set(cache_key, results, ttl=7200)  # 2 hours
        
        return results
        
    except Exception as e:
        logger.error(f"Similar products error: {str(e)}")
        raise HTTPException(status_code=500, detail="Similar products search failed")

@router.get("/suggestions")
async def get_search_suggestions(
    query: str,
    limit: int = 10,
    user = Depends(get_current_user_optional)
):
    """
    Get search suggestions based on partial query
    
    - **query**: Partial search query
    - **limit**: Maximum number of suggestions
    """
    try:
        suggestions = await search_service.get_search_suggestions(
            query=query,
            limit=limit,
            user_id=user.get("id") if user else None
        )
        
        return {"suggestions": suggestions}
        
    except Exception as e:
        logger.error(f"Search suggestions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get suggestions")

@router.post("/refine")
async def refine_search(
    search_id: str,
    feedback: Dict[str, Any],
    user = Depends(get_current_user_optional)
):
    """
    Refine search results based on user feedback
    
    - **search_id**: ID of the original search
    - **feedback**: User feedback (likes, dislikes, refinements)
    """
    try:
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        
        refined_results = await search_service.refine_search(
            search_id=search_id,
            feedback=feedback,
            user_id=user["id"]
        )
        
        return refined_results
        
    except Exception as e:
        logger.error(f"Search refinement error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search refinement failed")
