import asyncio
import time
import numpy as np
from typing import List, Dict, Any, Optional
from services.vector_service import VectorService
from services.embedder_service import EmbedderService
from services.database_service import DatabaseService
from services.pinterest_service import PinterestService
from utils.logger import get_logger

logger = get_logger(__name__)

class SearchService:
    def __init__(self):
        self.vector_service = VectorService()
        self.embedder_service = EmbedderService()
        self.db_service = DatabaseService()
        self.pinterest_service = PinterestService()
    
    async def text_search(
        self, 
        query: str, 
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Perform text-based search"""
        start_time = time.time()
        
        try:
            # Generate text embedding
            text_embedding = await self.embedder_service.embed_text(query)
            
            # Search vector database
            similar_products = await self.vector_service.search_similar(
                query_vector=text_embedding,
                limit=limit * 2,  # Get more for filtering
                filters=filters
            )
            
            # Apply additional filters and ranking
            filtered_products = await self._apply_filters_and_ranking(
                products=similar_products,
                filters=filters,
                user_id=user_id,
                limit=limit
            )
            
            search_time = time.time() - start_time
            
            return {
                "products": filtered_products,
                "total_count": len(filtered_products),
                "search_time": search_time,
                "query_embedding": text_embedding.tolist()
            }
            
        except Exception as e:
            logger.error(f"Text search failed: {str(e)}")
            raise
    
    async def image_search(
        self,
        images: List[str],
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Perform image-based search"""
        start_time = time.time()
        
        try:
            # Generate image embeddings
            image_embeddings = []
            for image_data in images:
                embedding = await self.embedder_service.embed_image(image_data)
                image_embeddings.append(embedding)
            
            # Combine multiple image embeddings
            combined_embedding = np.mean(image_embeddings, axis=0)
            
            # Search vector database
            similar_products = await self.vector_service.search_similar(
                query_vector=combined_embedding,
                limit=limit * 2,
                filters=filters
            )
            
            # Apply filters and ranking
            filtered_products = await self._apply_filters_and_ranking(
                products=similar_products,
                filters=filters,
                user_id=user_id,
                limit=limit
            )
            
            search_time = time.time() - start_time
            
            return {
                "products": filtered_products,
                "total_count": len(filtered_products),
                "search_time": search_time,
                "query_embedding": combined_embedding.tolist()
            }
            
        except Exception as e:
            logger.error(f"Image search failed: {str(e)}")
            raise
    
    async def combined_search(
        self,
        text: Optional[str] = None,
        images: Optional[List[str]] = None,
        pinterest_url: Optional[str] = None,
        mode: str = "combined",
        filters: Optional[Dict[str, Any]] = None,
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Perform multimodal search combining text, images, and Pinterest"""
        start_time = time.time()
        
        try:
            embeddings = []
            weights = []
            
            # Process text input
            if text:
                text_embedding = await self.embedder_service.embed_text(text)
                embeddings.append(text_embedding)
                weights.append(0.4)  # Text weight
            
            # Process image inputs
            if images:
                image_embeddings = []
                for image_data in images:
                    embedding = await self.embedder_service.embed_image(image_data)
                    image_embeddings.append(embedding)
                
                combined_image_embedding = np.mean(image_embeddings, axis=0)
                embeddings.append(combined_image_embedding)
                weights.append(0.5)  # Image weight
            
            # Process Pinterest URL
            if pinterest_url:
                pinterest_data = await self.pinterest_service.analyze_url(pinterest_url)
                pinterest_embedding = await self.embedder_service.embed_pinterest_data(pinterest_data)
                embeddings.append(pinterest_embedding)
                weights.append(0.3)  # Pinterest weight
            
            # Combine embeddings with weights
            if not embeddings:
                raise ValueError("No valid inputs provided")
            
            # Normalize weights
            weights = np.array(weights)
            weights = weights / np.sum(weights)
            
            # Weighted combination
            combined_embedding = np.average(embeddings, axis=0, weights=weights)
            
            # Search vector database
            similar_products = await self.vector_service.search_similar(
                query_vector=combined_embedding,
                limit=limit * 2,
                filters=filters
            )
            
            # Apply filters and ranking
            filtered_products = await self._apply_filters_and_ranking(
                products=similar_products,
                filters=filters,
                user_id=user_id,
                limit=limit
            )
            
            search_time = time.time() - start_time
            
            return {
                "products": filtered_products,
                "total_count": len(filtered_products),
                "search_time": search_time,
                "query_embedding": combined_embedding.tolist()
            }
            
        except Exception as e:
            logger.error(f"Combined search failed: {str(e)}")
            raise
    
    async def get_similar_products(
        self,
        product_id: str,
        limit: int = 20,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Find products similar to a given product"""
        try:
            # Get product embedding
            product_embedding = await self.vector_service.get_product_embedding(product_id)
            
            if product_embedding is None:
                raise ValueError(f"Product {product_id} not found")
            
            # Search for similar products
            similar_products = await self.vector_service.search_similar(
                query_vector=product_embedding,
                limit=limit + 1,  # +1 to exclude the original product
                exclude_ids=[product_id]
            )
            
            # Apply user-specific ranking
            if user_id:
                similar_products = await self._apply_user_preferences(
                    products=similar_products,
                    user_id=user_id
                )
            
            return {
                "products": similar_products[:limit],
                "total_count": len(similar_products),
                "search_time": 0.0
            }
            
        except Exception as e:
            logger.error(f"Similar products search failed: {str(e)}")
            raise
    
    async def get_search_suggestions(
        self,
        query: str,
        limit: int = 10,
        user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get search suggestions based on partial query"""
        try:
            # Get trending searches
            trending_suggestions = await self.db_service.get_trending_searches(limit=limit//2)
            
            # Get personalized suggestions if user is logged in
            personalized_suggestions = []
            if user_id:
                personalized_suggestions = await self.db_service.get_user_search_history(
                    user_id=user_id,
                    limit=limit//2
                )
            
            # Combine and filter suggestions
            all_suggestions = trending_suggestions + personalized_suggestions
            
            # Filter by query similarity
            filtered_suggestions = [
                suggestion for suggestion in all_suggestions
                if query.lower() in suggestion["text"].lower()
            ]
            
            return filtered_suggestions[:limit]
            
        except Exception as e:
            logger.error(f"Search suggestions failed: {str(e)}")
            return []
    
    async def refine_search(
        self,
        search_id: str,
        feedback: Dict[str, Any],
        user_id: str
    ) -> Dict[str, Any]:
        """Refine search results based on user feedback"""
        try:
            # Get original search data
            search_data = await self.db_service.get_search_by_id(search_id)
            
            if not search_data:
                raise ValueError(f"Search {search_id} not found")
            
            # Apply feedback to adjust query vector
            refined_embedding = await self._apply_feedback_to_embedding(
                original_embedding=np.array(search_data["query_embedding"]),
                feedback=feedback,
                user_id=user_id
            )
            
            # Perform new search with refined embedding
            similar_products = await self.vector_service.search_similar(
                query_vector=refined_embedding,
                limit=20,
                filters=search_data.get("filters")
            )
            
            # Save refined search
            refined_search_id = await self.db_service.save_search(
                user_id=user_id,
                query_embedding=refined_embedding.tolist(),
                results=similar_products,
                original_search_id=search_id
            )
            
            return {
                "search_id": refined_search_id,
                "products": similar_products,
                "total_count": len(similar_products),
                "search_time": 0.0
            }
            
        except Exception as e:
            logger.error(f"Search refinement failed: {str(e)}")
            raise
    
    async def track_search_event(
        self,
        user_id: str,
        query: str,
        search_type: str,
        result_count: int
    ):
        """Track search event for analytics"""
        try:
            await self.db_service.track_search_event({
                "user_id": user_id,
                "query": query,
                "search_type": search_type,
                "result_count": result_count,
                "timestamp": time.time()
            })
        except Exception as e:
            logger.error(f"Failed to track search event: {str(e)}")
    
    async def _apply_filters_and_ranking(
        self,
        products: List[Dict[str, Any]],
        filters: Optional[Dict[str, Any]],
        user_id: Optional[str],
        limit: int
    ) -> List[Dict[str, Any]]:
        """Apply filters and user-specific ranking to products"""
        try:
            filtered_products = products
            
            # Apply filters
            if filters:
                filtered_products = await self._apply_filters(filtered_products, filters)
            
            # Apply user preferences
            if user_id:
                filtered_products = await self._apply_user_preferences(filtered_products, user_id)
            
            # Apply trending boost
            filtered_products = await self._apply_trending_boost(filtered_products)
            
            return filtered_products[:limit]
            
        except Exception as e:
            logger.error(f"Filter and ranking failed: {str(e)}")
            return products[:limit]
    
    async def _apply_filters(
        self,
        products: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Apply search filters to products"""
        filtered = products
        
        # Price filter
        if "price_min" in filters or "price_max" in filters:
            price_min = filters.get("price_min", 0)
            price_max = filters.get("price_max", float('inf'))
            filtered = [
                p for p in filtered 
                if price_min <= p.get("price", 0) <= price_max
            ]
        
        # Brand filter
        if "brands" in filters:
            brands = filters["brands"]
            filtered = [
                p for p in filtered 
                if p.get("brand", "").lower() in [b.lower() for b in brands]
            ]
        
        # Category filter
        if "categories" in filters:
            categories = filters["categories"]
            filtered = [
                p for p in filtered 
                if p.get("category", "").lower() in [c.lower() for c in categories]
            ]
        
        # Color filter
        if "colors" in filters:
            colors = filters["colors"]
            filtered = [
                p for p in filtered 
                if any(color.lower() in p.get("colors", []) for color in colors)
            ]
        
        return filtered
    
    async def _apply_user_preferences(
        self,
        products: List[Dict[str, Any]],
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Apply user-specific preferences to ranking"""
        try:
            # Get user preferences
            user_prefs = await self.db_service.get_user_preferences(user_id)
            
            if not user_prefs:
                return products
            
            # Apply preference-based scoring
            for product in products:
                preference_score = 0
                
                # Brand preference
                if product.get("brand") in user_prefs.get("preferred_brands", []):
                    preference_score += 0.2
                
                # Category preference
                if product.get("category") in user_prefs.get("preferred_categories", []):
                    preference_score += 0.15
                
                # Style preference
                product_styles = product.get("styles", [])
                preferred_styles = user_prefs.get("preferred_styles", [])
                style_overlap = len(set(product_styles) & set(preferred_styles))
                preference_score += style_overlap * 0.1
                
                # Update similarity score
                product["similarity_score"] = product.get("similarity_score", 0) + preference_score
            
            # Re-sort by updated scores
            products.sort(key=lambda x: x.get("similarity_score", 0), reverse=True)
            
            return products
            
        except Exception as e:
            logger.error(f"User preference application failed: {str(e)}")
            return products
    
    async def _apply_trending_boost(
        self,
        products: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Apply trending boost to popular products"""
        try:
            # Get trending product IDs
            trending_products = await self.db_service.get_trending_products()
            trending_ids = {p["id"] for p in trending_products}
            
            # Apply trending boost
            for product in products:
                if product.get("id") in trending_ids:
                    product["similarity_score"] = product.get("similarity_score", 0) + 0.1
            
            # Re-sort
            products.sort(key=lambda x: x.get("similarity_score", 0), reverse=True)
            
            return products
            
        except Exception as e:
            logger.error(f"Trending boost failed: {str(e)}")
            return products
    
    async def _apply_feedback_to_embedding(
        self,
        original_embedding: np.ndarray,
        feedback: Dict[str, Any],
        user_id: str
    ) -> np.ndarray:
        """Apply user feedback to refine query embedding"""
        try:
            refined_embedding = original_embedding.copy()
            
            # Get embeddings of liked/disliked products
            liked_products = feedback.get("liked_products", [])
            disliked_products = feedback.get("disliked_products", [])
            
            # Move embedding towards liked products
            if liked_products:
                liked_embeddings = []
                for product_id in liked_products:
                    embedding = await self.vector_service.get_product_embedding(product_id)
                    if embedding is not None:
                        liked_embeddings.append(embedding)
                
                if liked_embeddings:
                    liked_centroid = np.mean(liked_embeddings, axis=0)
                    # Move 20% towards liked products
                    refined_embedding = 0.8 * refined_embedding + 0.2 * liked_centroid
            
            # Move embedding away from disliked products
            if disliked_products:
                disliked_embeddings = []
                for product_id in disliked_products:
                    embedding = await self.vector_service.get_product_embedding(product_id)
                    if embedding is not None:
                        disliked_embeddings.append(embedding)
                
                if disliked_embeddings:
                    disliked_centroid = np.mean(disliked_embeddings, axis=0)
                    # Move 10% away from disliked products
                    direction = refined_embedding - disliked_centroid
                    refined_embedding = refined_embedding + 0.1 * direction
            
            # Normalize the embedding
            refined_embedding = refined_embedding / np.linalg.norm(refined_embedding)
            
            return refined_embedding
            
        except Exception as e:
            logger.error(f"Feedback application failed: {str(e)}")
            return original_embedding
