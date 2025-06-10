import numpy as np
import base64
import io
from PIL import Image
from typing import List, Dict, Any, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
import hashlib
from utils.logger import get_logger

logger = get_logger(__name__)

class EmbedderService:
    """
    Service for generating embeddings from text, images, and other inputs.
    In production, this would use real CLIP/BLIP models.
    For now, it generates mock embeddings with realistic properties.
    """
    
    def __init__(self):
        self.dimension = 512
        self.executor = ThreadPoolExecutor(max_workers=4)
        self.text_cache = {}
        self.image_cache = {}
    
    async def embed_text(self, text: str) -> np.ndarray:
        """Generate text embedding using mock CLIP text encoder"""
        try:
            # Check cache first
            text_hash = hashlib.md5(text.encode()).hexdigest()
            if text_hash in self.text_cache:
                return self.text_cache[text_hash]
            
            # Generate mock embedding based on text content
            embedding = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._generate_text_embedding,
                text
            )
            
            # Cache the result
            self.text_cache[text_hash] = embedding
            
            return embedding
            
        except Exception as e:
            logger.error(f"Text embedding failed: {str(e)}")
            # Return random embedding as fallback
            return self._generate_random_embedding()
    
    async def embed_image(self, image_data: str) -> np.ndarray:
        """Generate image embedding using mock CLIP image encoder"""
        try:
            # Check cache first
            image_hash = hashlib.md5(image_data.encode()).hexdigest()
            if image_hash in self.image_cache:
                return self.image_cache[image_hash]
            
            # Process image
            image = await self._decode_base64_image(image_data)
            
            # Generate mock embedding
            embedding = await asyncio.get_event_loop().run_in_executor(
                self.executor,
                self._generate_image_embedding,
                image
            )
            
            # Cache the result
            self.image_cache[image_hash] = embedding
            
            return embedding
            
        except Exception as e:
            logger.error(f"Image embedding failed: {str(e)}")
            return self._generate_random_embedding()
    
    async def embed_pinterest_data(self, pinterest_data: Dict[str, Any]) -> np.ndarray:
        """Generate embedding from Pinterest data"""
        try:
            # Combine text and image data from Pinterest
            text_parts = []
            
            if "title" in pinterest_data:
                text_parts.append(pinterest_data["title"])
            
            if "description" in pinterest_data:
                text_parts.append(pinterest_data["description"])
            
            if "tags" in pinterest_data:
                text_parts.extend(pinterest_data["tags"])
            
            # Generate text embedding
            combined_text = " ".join(text_parts)
            text_embedding = await self.embed_text(combined_text)
            
            # If images are available, combine with image embeddings
            if "images" in pinterest_data and pinterest_data["images"]:
                image_embeddings = []
                for image_url in pinterest_data["images"][:3]:  # Limit to 3 images
                    # In production, download and process images
                    # For now, generate mock embedding based on URL
                    image_embedding = self._generate_mock_image_embedding_from_url(image_url)
                    image_embeddings.append(image_embedding)
                
                # Combine text and image embeddings
                all_embeddings = [text_embedding] + image_embeddings
                combined_embedding = np.mean(all_embeddings, axis=0)
                
                return combined_embedding / np.linalg.norm(combined_embedding)
            
            return text_embedding
            
        except Exception as e:
            logger.error(f"Pinterest embedding failed: {str(e)}")
            return self._generate_random_embedding()
    
    async def embed_product(self, product_data: Dict[str, Any]) -> np.ndarray:
        """Generate embedding for a product based on its metadata"""
        try:
            # Combine product text information
            text_parts = []
            
            if "title" in product_data:
                text_parts.append(product_data["title"])
            
            if "description" in product_data:
                text_parts.append(product_data["description"])
            
            if "brand" in product_data:
                text_parts.append(product_data["brand"])
            
            if "category" in product_data:
                text_parts.append(product_data["category"])
            
            if "colors" in product_data:
                text_parts.extend(product_data["colors"])
            
            if "styles" in product_data:
                text_parts.extend(product_data["styles"])
            
            if "tags" in product_data:
                text_parts.extend(product_data["tags"])
            
            # Generate text embedding
            combined_text = " ".join(text_parts)
            text_embedding = await self.embed_text(combined_text)
            
            # If product image is available, combine with image embedding
            if "image_url" in product_data:
                # In production, download and process the image
                # For now, generate mock embedding based on URL
                image_embedding = self._generate_mock_image_embedding_from_url(
                    product_data["image_url"]
                )
                
                # Combine text and image embeddings (70% text, 30% image)
                combined_embedding = 0.7 * text_embedding + 0.3 * image_embedding
                return combined_embedding / np.linalg.norm(combined_embedding)
            
            return text_embedding
            
        except Exception as e:
            logger.error(f"Product embedding failed: {str(e)}")
            return self._generate_random_embedding()
    
    def _generate_text_embedding(self, text: str) -> np.ndarray:
        """Generate mock text embedding with realistic properties"""
        # Create deterministic embedding based on text content
        text_lower = text.lower()
        
        # Initialize with random seed based on text hash
        seed = hash(text) % (2**32)
        np.random.seed(seed)
        
        # Base embedding
        embedding = np.random.normal(0, 1, self.dimension).astype('float32')
        
        # Add semantic-like patterns based on keywords
        fashion_keywords = {
            'minimalist': np.array([1, 0, 0, 1, 0] * (self.dimension // 5)),
            'vintage': np.array([0, 1, 0, 0, 1] * (self.dimension // 5)),
            'streetwear': np.array([1, 1, 0, 1, 0] * (self.dimension // 5)),
            'formal': np.array([0, 0, 1, 1, 1] * (self.dimension // 5)),
            'casual': np.array([1, 0, 1, 0, 1] * (self.dimension // 5)),
            'bohemian': np.array([0, 1, 1, 0, 0] * (self.dimension // 5)),
            'gothic': np.array([1, 1, 1, 0, 0] * (self.dimension // 5)),
            'preppy': np.array([0, 0, 0, 1, 1] * (self.dimension // 5))
        }
        
        # Apply keyword influences
        for keyword, pattern in fashion_keywords.items():
            if keyword in text_lower:
                embedding += 0.3 * pattern[:self.dimension]
        
        # Color influences
        color_patterns = {
            'black': 0.2,
            'white': -0.2,
            'red': 0.1,
            'blue': -0.1,
            'green': 0.15,
            'yellow': -0.15
        }
        
        for color, influence in color_patterns.items():
            if color in text_lower:
                embedding[::10] += influence  # Affect every 10th dimension
        
        # Normalize
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding
    
    def _generate_image_embedding(self, image: Image.Image) -> np.ndarray:
        """Generate mock image embedding based on image properties"""
        try:
            # Get basic image properties
            width, height = image.size
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Get average color
            avg_color = np.array(image.resize((1, 1)).getpixel((0, 0)))
            
            # Create deterministic embedding based on image properties
            seed = int(np.sum(avg_color) + width + height) % (2**32)
            np.random.seed(seed)
            
            # Base embedding
            embedding = np.random.normal(0, 1, self.dimension).astype('float32')
            
            # Add color-based patterns
            color_influence = avg_color / 255.0  # Normalize to 0-1
            embedding[:3] += color_influence * 0.5
            
            # Add size-based patterns
            aspect_ratio = width / height
            embedding[3] += (aspect_ratio - 1) * 0.3
            
            # Add brightness influence
            brightness = np.mean(color_influence)
            embedding[4] += (brightness - 0.5) * 0.4
            
            # Normalize
            embedding = embedding / np.linalg.norm(embedding)
            
            return embedding
            
        except Exception as e:
            logger.error(f"Image embedding generation failed: {str(e)}")
            return self._generate_random_embedding()
    
    def _generate_mock_image_embedding_from_url(self, image_url: str) -> np.ndarray:
        """Generate mock image embedding based on URL (for demo purposes)"""
        # Create deterministic embedding based on URL
        url_hash = hash(image_url) % (2**32)
        np.random.seed(url_hash)
        
        embedding = np.random.normal(0, 1, self.dimension).astype('float32')
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding
    
    async def _decode_base64_image(self, image_data: str) -> Image.Image:
        """Decode base64 image data"""
        try:
            # Remove data URL prefix if present
            if image_data.startswith('data:image'):
                image_data = image_data.split(',')[1]
            
            # Decode base64
            image_bytes = base64.b64decode(image_data)
            
            # Open image
            image = Image.open(io.BytesIO(image_bytes))
            
            return image
            
        except Exception as e:
            logger.error(f"Image decoding failed: {str(e)}")
            # Return a small dummy image
            return Image.new('RGB', (100, 100), color='white')
    
    def _generate_random_embedding(self) -> np.ndarray:
        """Generate random normalized embedding as fallback"""
        embedding = np.random.normal(0, 1, self.dimension).astype('float32')
        return embedding / np.linalg.norm(embedding)
    
    async def batch_embed_texts(self, texts: List[str]) -> List[np.ndarray]:
        """Generate embeddings for multiple texts efficiently"""
        tasks = [self.embed_text(text) for text in texts]
        return await asyncio.gather(*tasks)
    
    async def batch_embed_images(self, images: List[str]) -> List[np.ndarray]:
        """Generate embeddings for multiple images efficiently"""
        tasks = [self.embed_image(image) for image in images]
        return await asyncio.gather(*tasks)
    
    def clear_cache(self):
        """Clear embedding caches"""
        self.text_cache.clear()
        self.image_cache.clear()
        logger.info("Embedding caches cleared")
    
    def get_cache_stats(self) -> Dict[str, int]:
        """Get cache statistics"""
        return {
            "text_cache_size": len(self.text_cache),
            "image_cache_size": len(self.image_cache)
        }
