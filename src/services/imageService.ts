// Image service for fetching free images from Unsplash API
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // You'll need to get this from Unsplash
const UNSPLASH_API_URL = 'https://api.unsplash.com';

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
  };
}

class ImageService {
  private accessKey: string;

  constructor() {
    this.accessKey = UNSPLASH_ACCESS_KEY;
  }

  // Get random images for categories
  async getCategoryImages(category: string, count: number = 8): Promise<string[]> {
    const keywords = this.getCategoryKeywords(category);
    const images: string[] = [];

    for (const keyword of keywords) {
      try {
        const response = await fetch(
          `${UNSPLASH_API_URL}/search/photos?query=${keyword}&per_page=${count}&client_id=${this.accessKey}`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          images.push(...data.results.map((img: UnsplashImage) => img.urls.regular));
        }
      } catch (error) {
        console.error(`Error fetching images for ${keyword}:`, error);
      }
    }

    return images.slice(0, count);
  }

  // Get product images
  async getProductImages(productType: string, count: number = 1): Promise<string[]> {
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${productType}&per_page=${count}&client_id=${this.accessKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((img: UnsplashImage) => img.urls.regular);
      }
    } catch (error) {
      console.error(`Error fetching product images for ${productType}:`, error);
    }

    return [];
  }

  // Get auction images
  async getAuctionImages(itemType: string, count: number = 1): Promise<string[]> {
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${itemType} auction collectible&per_page=${count}&client_id=${this.accessKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((img: UnsplashImage) => img.urls.regular);
      }
    } catch (error) {
      console.error(`Error fetching auction images for ${itemType}:`, error);
    }

    return [];
  }

  // Get hero banner images
  async getHeroImages(count: number = 3): Promise<string[]> {
    const heroKeywords = ['shopping', 'ecommerce', 'marketplace', 'auction', 'online store'];
    const images: string[] = [];

    for (const keyword of heroKeywords) {
      try {
        const response = await fetch(
          `${UNSPLASH_API_URL}/search/photos?query=${keyword}&per_page=1&client_id=${this.accessKey}`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          images.push(data.results[0].urls.full);
        }
      } catch (error) {
        console.error(`Error fetching hero image for ${keyword}:`, error);
      }
    }

    return images.slice(0, count);
  }

  // Map categories to search keywords
  private getCategoryKeywords(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'electronics': ['electronics', 'gadgets', 'technology', 'smartphone', 'laptop'],
      'fashion': ['fashion', 'clothing', 'style', 'apparel', 'dress'],
      'home-garden': ['home decor', 'furniture', 'garden', 'interior design'],
      'sports': ['sports', 'fitness', 'athletic', 'exercise', 'gym'],
      'books': ['books', 'reading', 'library', 'literature'],
      'automotive': ['car', 'automotive', 'vehicle', 'auto parts'],
      'health-beauty': ['beauty', 'cosmetics', 'skincare', 'health'],
      'toys-games': ['toys', 'games', 'play', 'children']
    };

    return categoryMap[category] || [category];
  }

  // Fallback to placeholder images if API fails
  getPlaceholderImages(type: 'product' | 'category' | 'auction' | 'hero', count: number = 1): string[] {
    const placeholders: { [key: string]: string[] } = {
      product: [
        'https://via.placeholder.com/400x400/83b735/ffffff?text=Product',
        'https://via.placeholder.com/400x400/333333/ffffff?text=Product',
        'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Product'
      ],
      category: [
        'https://via.placeholder.com/300x200/83b735/ffffff?text=Category',
        'https://via.placeholder.com/300x200/333333/ffffff?text=Category',
        'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Category'
      ],
      auction: [
        'https://via.placeholder.com/400x300/83b735/ffffff?text=Auction',
        'https://via.placeholder.com/400x300/333333/ffffff?text=Auction',
        'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Auction'
      ],
      hero: [
        'https://via.placeholder.com/1200x600/83b735/ffffff?text=Welcome+to+XpertBid',
        'https://via.placeholder.com/1200x600/333333/ffffff?text=Live+Auctions',
        'https://via.placeholder.com/1200x600/ff6b6b/ffffff?text=Become+a+Vendor'
      ]
    };

    const basePlaceholders = placeholders[type] || placeholders.product;
    const result: string[] = [];
    
    for (let i = 0; i < count; i++) {
      result.push(basePlaceholders[i % basePlaceholders.length]);
    }
    
    return result;
  }

  // Get random image from a collection
  getRandomImage(images: string[]): string {
    if (images.length === 0) return this.getPlaceholderImages('product')[0];
    return images[Math.floor(Math.random() * images.length)];
  }
}

// Create and export a singleton instance
export const imageService = new ImageService();
export default imageService;
