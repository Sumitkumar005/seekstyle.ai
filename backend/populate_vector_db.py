#!/usr/bin/env python3
"""
Script to populate the vector database with fashion product embeddings.
This script generates mock data for development and testing.
In production, this would process real product catalogs.
"""

import asyncio
import numpy as np
import json
import os
from typing import List, Dict, Any
from services.vector_service import VectorService
from services.embedder_service import EmbedderService
from utils.logger import setup_logger

logger = setup_logger(__name__)

class VectorDBPopulator:
    def __init__(self):
        self.vector_service = VectorService()
        self.embedder_service = EmbedderService()
    
    async def populate_database(self, num_products: int = 5000):
        """Populate vector database with fashion products"""
        try:
            logger.info(f"Starting to populate vector DB with {num_products} products")
            
            # Initialize services
            await self.vector_service.initialize()
            
            # Generate product data in batches
            batch_size = 100
            total_processed = 0
            
            for batch_start in range(0, num_products, batch_size):
                batch_end = min(batch_start + batch_size, num_products)
                batch_size_actual = batch_end - batch_start
                
                logger.info(f"Processing batch {batch_start}-{batch_end}")
                
                # Generate batch of products
                products = await self._generate_product_batch(
                    start_id=batch_start,
                    count=batch_size_actual
                )
                
                # Generate embeddings for batch
                await self._process_product_batch(products)
                
                total_processed += len(products)
                logger.info(f"Processed {total_processed}/{num_products} products")
            
            # Get final stats
            stats = await self.vector_service.get_index_stats()
            logger.info(f"Vector DB population complete: {stats}")
            
        except Exception as e:
            logger.error(f"Vector DB population failed: {str(e)}")
            raise
    
    async def _generate_product_batch(self, start_id: int, count: int) -> List[Dict[str, Any]]:
        """Generate a batch of mock fashion products"""
        
        # Fashion data for realistic generation
        brands = [
            "Zara", "H&M", "Mango", "ASOS", "Nike", "Adidas", "Uniqlo", "COS", 
            "Arket", "Massimo Dutti", "Bershka", "Pull & Bear", "Stradivarius",
            "Urban Outfitters", "Forever 21", "Topshop", "Nordstrom", "Saks",
            "Gucci", "Prada", "Louis Vuitton", "Chanel", "Dior", "Versace"
        ]
        
        categories = [
            "tops", "dresses", "bottoms", "outerwear", "shoes", "accessories",
            "bags", "jewelry", "watches", "sunglasses", "hats", "scarves"
        ]
        
        subcategories = {
            "tops": ["t-shirts", "blouses", "sweaters", "hoodies", "tank tops", "crop tops"],
            "dresses": ["midi dresses", "maxi dresses", "mini dresses", "cocktail dresses", "casual dresses"],
            "bottoms": ["jeans", "trousers", "shorts", "skirts", "leggings", "joggers"],
            "outerwear": ["jackets", "coats", "blazers", "cardigans", "vests", "parkas"],
            "shoes": ["sneakers", "boots", "heels", "flats", "sandals", "loafers"],
            "accessories": ["belts", "wallets", "phone cases", "keychains", "hair accessories"]
        }
        
        colors = [
            "black", "white", "gray", "navy", "blue", "red", "pink", "green",
            "yellow", "purple", "brown", "beige", "cream", "orange", "burgundy",
            "olive", "teal", "coral", "lavender", "mint", "gold", "silver"
        ]
        
        styles = [
            "minimalist", "streetwear", "bohemian", "vintage", "formal", "casual",
            "gothic", "preppy", "romantic", "edgy", "classic", "trendy",
            "artsy", "sporty", "elegant", "quirky", "sophisticated", "playful"
        ]
        
        occasions = [
            "work", "casual", "party", "date night", "vacation", "gym",
            "formal event", "weekend", "brunch", "shopping", "travel"
        ]
        
        materials = [
            "cotton", "polyester", "wool", "silk", "linen", "denim",
            "leather", "cashmere", "viscose", "modal", "bamboo", "hemp"
        ]
        
        products = []
        
        for i in range(count):
            product_id = start_id + i
            category = np.random.choice(categories)
            subcategory = np.random.choice(subcategories.get(category, [category]))
            brand = np.random.choice(brands)
            
            # Generate realistic product name
            style_adj = np.random.choice(["Classic", "Modern", "Vintage", "Trendy", "Elegant", "Casual"])
            product_name = f"{style_adj} {subcategory.title()}"
            
            # Generate price based on brand tier
            luxury_brands = ["Gucci", "Prada", "Louis Vuitton", "Chanel", "Dior", "Versace"]
            if brand in luxury_brands:
                price_range = (500, 3000)
            elif brand in ["COS", "Arket", "Massimo Dutti"]:
                price_range = (80, 300)
            else:
                price_range = (20, 150)
            
            price = round(np.random.uniform(*price_range), 2)
            
            # Generate product colors (1-3 colors)
            num_colors = np.random.randint(1, 4)
            product_colors = list(np.random.choice(colors, size=num_colors, replace=False))
            
            # Generate styles (1-3 styles)
            num_styles = np.random.randint(1, 4)
            product_styles = list(np.random.choice(styles, size=num_styles, replace=False))
            
            # Generate occasions (1-2 occasions)
            num_occasions = np.random.randint(1, 3)
            product_occasions = list(np.random.choice(occasions, size=num_occasions, replace=False))
            
            # Generate materials (1-2 materials)
            num_materials = np.random.randint(1, 3)
            product_materials = list(np.random.choice(materials, size=num_materials, replace=False))
            
            # Generate sizes based on category
            if category in ["shoes"]:
                sizes = ["6", "7", "8", "9", "10", "11"]
            elif category in ["accessories", "bags", "jewelry", "watches", "sunglasses"]:
                sizes = ["One Size"]
            else:
                sizes = ["XS", "S", "M", "L", "XL", "XXL"]
            
            # Generate description
            description = f"Stylish {subcategory} from {brand}. Perfect for {', '.join(product_occasions)}. " \
                         f"Made from {', '.join(product_materials)}. Features {', '.join(product_styles)} design."
            
            # Generate tags
            tags = product_colors + product_styles + product_occasions + [category, subcategory, brand.lower()]
            
            product = {
                "id": f"product_{product_id:06d}",
                "title": product_name,
                "description": description,
                "brand": brand,
                "category": category,
                "subcategory": subcategory,
                "price": price,
                "colors": product_colors,
                "styles": product_styles,
                "occasions": product_occasions,
                "materials": product_materials,
                "sizes": sizes,
                "tags": tags,
                "image_url": f"/api/images/product_{product_id:06d}.jpg",
                "retailer_url": f"https://{brand.lower().replace(' ', '')}.com/product/{product_id}",
                "affiliate_url": f"https://affiliate.seekstyle.ai/redirect/{product_id}",
                "rating": round(np.random.uniform(3.0, 5.0), 1),
                "review_count": np.random.randint(5, 500),
                "availability": np.random.choice(
                    ["in_stock", "low_stock", "out_of_stock"], 
                    p=[0.8, 0.15, 0.05]
                ),
                "gender": np.random.choice(["unisex", "women", "men"], p=[0.3, 0.5, 0.2]),
                "season": np.random.choice(["spring", "summer", "fall", "winter", "all_season"], p=[0.2, 0.2, 0.2, 0.2, 0.2]),
                "trending_score": np.random.uniform(0, 1),
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
            
            products.append(product)
        
        return products
    
    async def _process_product_batch(self, products: List[Dict[str, Any]]):
        """Process a batch of products and add to vector database"""
        try:
            for product in products:
                # Generate embedding for product
                embedding = await self.embedder_service.embed_product(product)
                
                # Add to vector database
                await self.vector_service.add_product(
                    product_id=product["id"],
                    embedding=embedding,
                    metadata=product
                )
            
        except Exception as e:
            logger.error(f"Batch processing failed: {str(e)}")
            raise
    
    async def export_sample_data(self, output_file: str = "sample_products.json"):
        """Export sample product data for testing"""
        try:
            # Generate sample products
            sample_products = await self._generate_product_batch(start_id=0, count=50)
            
            # Save to file
            with open(output_file, 'w') as f:
                json.dump(sample_products, f, indent=2)
            
            logger.info(f"Exported {len(sample_products)} sample products to {output_file}")
            
        except Exception as e:
            logger.error(f"Sample data export failed: {str(e)}")
            raise

async def main():
    """Main function to run the vector DB population"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Populate SeekStyle.ai vector database")
    parser.add_argument("--products", type=int, default=5000, help="Number of products to generate")
    parser.add_argument("--export-sample", action="store_true", help="Export sample data only")
    parser.add_argument("--sample-file", default="sample_products.json", help="Sample data output file")
    
    args = parser.parse_args()
    
    populator = VectorDBPopulator()
    
    if args.export_sample:
        await populator.export_sample_data(args.sample_file)
    else:
        await populator.populate_database(args.products)

if __name__ == "__main__":
    asyncio.run(main())
