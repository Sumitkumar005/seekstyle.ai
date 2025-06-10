import numpy as np
import faiss
import pickle
import os
from typing import List, Dict, Any, Optional, Tuple
import asyncio
from concurrent.futures import ThreadPoolExecutor
from utils.logger import get_logger

logger = get_logger(__name__)

class VectorService:
    def __init__(self):
        self.index = None
        self.product_metadata = {}
        self.id_to_index = {}
        self.index_to_id = {}
        self.dimension = 512  # CLIP embedding dimension
        self.executor = ThreadPoolExecutor(max_workers=4)
        
    async def initialize(self):
        """Initialize FAISS index and load product data"""
        try:
            await self._load_or_create_index()
            await self._load_product_metadata()
            logger.info("Vector service initialized successfully")
        except Exception as e:
            logger.error(f"Vector service initialization failed: {str(e)}")
            raise
    
    async def _load_or_create_index(self):
        """Load existing FAISS index or create new one"""
        index_path = "data/faiss_index.bin"
        
        if os.path.exists(index_path):
            # Load existing index
            self.index = faiss.read_index(index_path)
            logger.info(f"Loaded FAISS index with {self.index.ntotal} vectors")
        else:
            # Create new index
            self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for cosine similarity
            logger.info("Created new FAISS index")
            
            # Populate with mock data
            await self._populate_mock_data()
    
    async def _load_product_metadata(self):
        """Load product metadata"""
        metadata_path = "data/product_metadata.pkl"
        
        if os.path.exists(metadata_path):
            with open(metadata_path, 'rb') as f:
                data = pickle.load(f)
                self.product_metadata = data['metadata']
                self.id_to_index = data['id_to_index']
                self.index_to_id = data['index_to_id']
            logger.info(f"Loaded metadata for {len(self.product_metadata)} products")
        else:
            logger.warning("No product metadata found")
    
    async def _populate_mock_data(self):
        """Populate index with mock fashion product data"""
        try:
            # Generate mock product data
            mock_products = await self._generate_mock_products(1000)
            
            # Generate embeddings for mock products
            embeddings = []
            for i, product in enumerate(mock_products):
                # Generate random embedding (in production, use real CLIP embeddings)
                embedding = np.random.normal(0, 1, self.dimension).astype('float32')
                embedding = embedding / np.linalg.norm(embedding)  # Normalize
                embeddings.append(embedding)
                
                # Store metadata
                self.product_metadata[product['id']] = product
                self.id_to_index[product['id']] = i
                self.index_to_id[i] = product['id']
            
            # Add to FAISS index
            embeddings_array = np.array(embeddings)
            self.index.add(embeddings_array)
            
            # Save index and metadata
            os.makedirs("data", exist_ok=True)
            faiss.write_index(self.index, "data/faiss_index.bin")
            
            with open("data/product_metadata.pkl", 'wb') as f:
                pickle.dump({
                    'metadata': self.product_metadata,
                    'id_to_index': self.id_to_index,
                    'index_to_id': self.index_to_id
                }, f)
            
            logger.info(f"Populated FAISS index with {len(mock_products)} mock products")
            
        except Exception as e:
            logger.error(f"Mock data population failed: {str(e)}")
            raise
    
    async def _generate_mock_products(self, count: int) -> List[Dict[str, Any]]:
        """Generate mock fashion product data"""
        brands = ["Zara", "H&M", "Mango", "ASOS", "Nike", "Adidas", "Uniqlo", "COS", "Arket", "Massimo Dutti"]
        categories = ["tops", "dresses", "bottoms", "outerwear", "shoes", "accessories"]
        colors = ["black", "white", "blue", "red", "green", "yellow", "purple", "pink", "brown", "gray"]
        styles = ["minimalist", "streetwear", "bohemian", "vintage", "formal", "casual", "gothic", "preppy"]
        
        products = []
        for i in range(count):
            product = {
                "id": f"product_{i+1}",
                "title": f"Fashion Item {i+1}",
                "description": f"Stylish fashion item with unique design",
                "price": round(np.random.uniform(20, 300), 2),
                "brand": np.random.choice(brands),
                "category": np.random.choice(categories),
                "colors": list(np.random.choice(colors, size=np.random.randint(1, 4), replace=False)),
                "styles": list(np.random.choice(styles, size=np.random.randint(1, 3), replace=False)),
                "image_url": f"/placeholder.svg?height=400&width=300&text=Product{i+1}",
                "retailer_url": f"https://example-retailer.com/product/{i+1}",
                "affiliate_url": f"https://affiliate.com/product/{i+1}",
                "rating": round(np.random.uniform(3.5, 5.0), 1),
                "review_count": np.random.randint(10, 1000),
                "availability": np.random.choice(["in_stock", "low_stock", "out_of_stock"], p=[0.7, 0.2, 0.1]),
                "sizes": ["XS", "S", "M", "L", "XL"],
                "tags": list(np.random.choice(styles + colors, size=np.random.randint(2, 5), replace=False)),
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
            products.append(product)
        
        return products
    
    async def search_similar(
        self,
        query_vector: np.ndarray,
        limit: int = 20,
        filters: Optional[Dict[str, Any]] = None,
        exclude_ids: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar products using vector similarity"""
        try:
            # Normalize query vector
            query_vector = query_vector.astype('float32')
            query_vector = query_vector / np.linalg.norm(query_vector)
            query_vector = query_vector.reshape(1, -1)
            
            # Search FAISS index
            search_limit = min(limit * 5, self.index.ntotal)  # Get more results for filtering
            scores, indices = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self.index.search,
                query_vector,
                search_limit
            )
            
            # Convert results to products
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx == -1:  # FAISS returns -1 for invalid indices
                    continue
                
                product_id = self.index_to_id.get(idx)
                if not product_id:
                    continue
                
                # Skip excluded products
                if exclude_ids and product_id in exclude_ids:
                    continue
                
                product = self.product_metadata.get(product_id)
                if not product:
                    continue
                
                # Add similarity score
                product_copy = product.copy()
                product_copy['similarity_score'] = float(score)
                
                results.append(product_copy)
            
            # Apply filters if provided
            if filters:
                results = await self._apply_vector_filters(results, filters)
            
            # Sort by similarity score and limit results
            results.sort(key=lambda x: x['similarity_score'], reverse=True)
            
            return results[:limit]
            
        except Exception as e:
            logger.error(f"Vector search failed: {str(e)}")
            return []
    
    async def get_product_embedding(self, product_id: str) -> Optional[np.ndarray]:
        """Get embedding vector for a specific product"""
        try:
            index = self.id_to_index.get(product_id)
            if index is None:
                return None
            
            # Get vector from FAISS index
            vector = self.index.reconstruct(index)
            return vector
            
        except Exception as e:
            logger.error(f"Failed to get product embedding: {str(e)}")
            return None
    
    async def add_product(
        self,
        product_id: str,
        embedding: np.ndarray,
        metadata: Dict[str, Any]
    ):
        """Add new product to vector index"""
        try:
            # Normalize embedding
            embedding = embedding.astype('float32')
            embedding = embedding / np.linalg.norm(embedding)
            
            # Add to index
            new_index = self.index.ntotal
            self.index.add(embedding.reshape(1, -1))
            
            # Update mappings
            self.id_to_index[product_id] = new_index
            self.index_to_id[new_index] = product_id
            self.product_metadata[product_id] = metadata
            
            # Save updated data
            await self._save_index_and_metadata()
            
            logger.info(f"Added product {product_id} to vector index")
            
        except Exception as e:
            logger.error(f"Failed to add product: {str(e)}")
            raise
    
    async def update_product(
        self,
        product_id: str,
        embedding: Optional[np.ndarray] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Update existing product in vector index"""
        try:
            if product_id not in self.id_to_index:
                raise ValueError(f"Product {product_id} not found")
            
            # Update metadata
            if metadata:
                self.product_metadata[product_id].update(metadata)
            
            # Update embedding (requires rebuilding index)
            if embedding is not None:
                # For now, just update metadata
                # In production, implement incremental index updates
                pass
            
            await self._save_index_and_metadata()
            
            logger.info(f"Updated product {product_id}")
            
        except Exception as e:
            logger.error(f"Failed to update product: {str(e)}")
            raise
    
    async def remove_product(self, product_id: str):
        """Remove product from vector index"""
        try:
            if product_id not in self.id_to_index:
                return
            
            # Remove from mappings and metadata
            index = self.id_to_index.pop(product_id)
            self.index_to_id.pop(index, None)
            self.product_metadata.pop(product_id, None)
            
            # Note: FAISS doesn't support efficient removal
            # In production, implement periodic index rebuilding
            
            await self._save_index_and_metadata()
            
            logger.info(f"Removed product {product_id}")
            
        except Exception as e:
            logger.error(f"Failed to remove product: {str(e)}")
            raise
    
    async def _apply_vector_filters(
        self,
        products: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Apply filters to vector search results"""
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
            brands = [b.lower() for b in filters["brands"]]
            filtered = [
                p for p in filtered 
                if p.get("brand", "").lower() in brands
            ]
        
        # Category filter
        if "categories" in filters:
            categories = [c.lower() for c in filters["categories"]]
            filtered = [
                p for p in filtered 
                if p.get("category", "").lower() in categories
            ]
        
        # Color filter
        if "colors" in filters:
            colors = [c.lower() for c in filters["colors"]]
            filtered = [
                p for p in filtered 
                if any(color in colors for color in [c.lower() for c in p.get("colors", [])])
            ]
        
        # Style filter
        if "styles" in filters:
            styles = [s.lower() for s in filters["styles"]]
            filtered = [
                p for p in filtered 
                if any(style in styles for style in [s.lower() for s in p.get("styles", [])])
            ]
        
        # Availability filter
        if "availability" in filters:
            availability = filters["availability"]
            filtered = [
                p for p in filtered 
                if p.get("availability") == availability
            ]
        
        return filtered
    
    async def _save_index_and_metadata(self):
        """Save FAISS index and metadata to disk"""
        try:
            os.makedirs("data", exist_ok=True)
            
            # Save FAISS index
            faiss.write_index(self.index, "data/faiss_index.bin")
            
            # Save metadata
            with open("data/product_metadata.pkl", 'wb') as f:
                pickle.dump({
                    'metadata': self.product_metadata,
                    'id_to_index': self.id_to_index,
                    'index_to_id': self.index_to_id
                }, f)
            
        except Exception as e:
            logger.error(f"Failed to save index and metadata: {str(e)}")
            raise
    
    async def get_index_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector index"""
        return {
            "total_vectors": self.index.ntotal if self.index else 0,
            "dimension": self.dimension,
            "total_products": len(self.product_metadata),
            "index_type": type(self.index).__name__ if self.index else None
        }
    
    async def close(self):
        """Clean up resources"""
        if self.executor:
            self.executor.shutdown(wait=True)
        logger.info("Vector service closed")
