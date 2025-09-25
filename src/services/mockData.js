// Mock data service to prevent API errors during development
export const mockData = {
  // Mock currencies
  currencies: [
    { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { id: 2, code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 }
  ],

  // Mock languages
  languages: [
    { id: 1, code: 'en', name: 'English', flag: '🇺🇸' },
    { id: 2, code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 3, code: 'fr', name: 'French', flag: '🇫🇷' }
  ],

  // Mock translations
  translations: {
    en: {},
    es: {},
    fr: {}
  },

  // Mock blog posts
  blogPosts: [
    {
      id: 1,
      title: 'Modern Furniture Trends for 2024',
      slug: 'modern-furniture-trends-2024',
      excerpt: 'Discover the latest furniture trends that will transform your home.',
      content: 'Full blog post content here...',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
      author: 'XpertBid Team',
      publishedAt: '2024-01-15',
      category: 'Furniture'
    },
    {
      id: 2,
      title: 'How to Choose the Perfect Sofa',
      slug: 'choose-perfect-sofa',
      excerpt: 'A comprehensive guide to selecting the ideal sofa for your living space.',
      content: 'Full blog post content here...',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=800&h=400&fit=crop',
      author: 'Interior Design Expert',
      publishedAt: '2024-01-10',
      category: 'Living Room'
    },
    {
      id: 3,
      title: 'Kitchen Design Ideas for Small Spaces',
      slug: 'kitchen-design-small-spaces',
      excerpt: 'Maximize your kitchen potential with these space-saving design tips.',
      content: 'Full blog post content here...',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
      author: 'Kitchen Specialist',
      publishedAt: '2024-01-05',
      category: 'Kitchen'
    }
  ],

  // Mock featured products
  featuredProducts: [
    {
      id: 1,
      name: 'Modern Wooden Dining Table',
      slug: 'modern-wooden-dining-table',
      price: 899.99,
      comparePrice: 1199.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      badge: 'Sale',
      badgeColor: 'primary',
      rating: 4.8,
      reviewsCount: 124,
      isFeatured: true
    },
    {
      id: 2,
      name: 'Comfortable Sectional Sofa',
      slug: 'comfortable-sectional-sofa',
      price: 1299.99,
      comparePrice: null,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=400&fit=crop',
      badge: 'Featured',
      badgeColor: 'success',
      rating: 4.9,
      reviewsCount: 89,
      isFeatured: true
    },
    {
      id: 3,
      name: 'Elegant Bedroom Set',
      slug: 'elegant-bedroom-set',
      price: 1599.99,
      comparePrice: 1999.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      badge: 'New',
      badgeColor: 'info',
      rating: 4.7,
      reviewsCount: 67,
      isFeatured: true
    }
  ]
};

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApiResponses = {
  currencies: () => ({
    success: true,
    data: mockData.currencies
  }),

  languages: () => ({
    success: true,
    data: mockData.languages
  }),

  translations: (languageCode) => ({
    success: true,
    data: mockData.translations[languageCode] || {}
  }),

  blogPosts: () => ({
    success: true,
    data: mockData.blogPosts
  }),

  featuredProducts: () => ({
    success: true,
    data: mockData.featuredProducts
  })
};
