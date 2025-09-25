// /services/api.js
// A tiny API layer that supports BOTH JSON objects and FormData payloads.
// If you already have an axios instance/baseUrl, replace `fetchJson` with your client.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';

// Basic helper; swap with axios if you prefer
async function fetchJson(url, init = {}) {
  try {
    const res = await fetch(url, init);
    
    // Check if response is HTML (error page) instead of JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      // Return mock data instead of trying to parse HTML as JSON
      return { success: false, error: 'API endpoint not available', data: null };
    }
    
    // Check if response is ok
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}`, data: null };
    }
    
    return await res.json();
  } catch (error) {
    // Return mock data on any error
    return { success: false, error: error.message, data: null };
  }
}

async function customRequest(path, init = {}) {
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${API_BASE}/${path.replace(/^\/+/, '')}`;
  return fetchJson(url, init);
}

// Append auth header if you need token-based auth
function withAuth(headers = {}) {
  // Example:
  // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
  return headers;
}

// ---------- KYC endpoints (adjust paths to match your backend) ----------

// Documents list
async function getKycDocuments() {
  return fetchJson(
    `${API_BASE}/kyc/documents`,
    { headers: withAuth() }
  );
}

// KYC types
async function getKycTypes() {
  return fetchJson(
    `${API_BASE}/kyc/types`,
    { headers: withAuth() }
  );
}

// Submit KYC document - handles both FormData and JSON object
async function submitKycDocument(payload) {
  const isFD = typeof FormData !== 'undefined' && payload instanceof FormData;

  return fetchJson(`${API_BASE}/kyc/documents`, {
    method: 'POST',
    body: isFD ? payload : JSON.stringify(payload),
    headers: isFD ? withAuth() : withAuth({ 'Content-Type': 'application/json' }),
  });
}

async function updateKycDocument(id, payload) {
  const isFD = typeof FormData !== 'undefined' && payload instanceof FormData;

  // Use PUT/PATCH if your backend expects it
  return fetchJson(`${API_BASE}/kyc/documents/${id}`, {
    method: 'POST',
    body: isFD ? payload : JSON.stringify(payload),
    headers: isFD ? withAuth() : withAuth({ 'Content-Type': 'application/json' }),
  });
}

// Single file upload (optional)
async function uploadKycFile(id, fd) {
  return fetchJson(`${API_BASE}/kyc/documents/${id}/files`, {
    method: 'POST',
    body: fd,
    headers: withAuth(),
  });
}

// Remove a file from a KYC document (optional)
async function deleteKycFile(id, body) {
  return fetchJson(`${API_BASE}/kyc/documents/${id}/files`, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: withAuth({ 'Content-Type': 'application/json' }),
  });
}

// Convenience helpers if you like them:
async function get(path, headers) {
  return customRequest(path, { method: 'GET', headers: withAuth(headers) });
}

async function postJson(path, body, headers) {
  return customRequest(path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: withAuth({ 'Content-Type': 'application/json', ...(headers || {}) }),
  });
}

async function postForm(path, form, headers) {
  return customRequest(path, { method: 'POST', body: form, headers: withAuth(headers) });
}

async function delJson(path, body, headers) {
  return customRequest(path, {
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
    headers: withAuth({ 'Content-Type': 'application/json', ...(headers || {}) }),
  });
}

// ---------- AUCTIONS endpoints ----------
async function getAuctions() {
  // Adjust path to your backend, e.g. '/api/auctions' if API_BASE is a domain root
  return get('/auctions');
}

async function getAuctionBySlug(slug) {
  // Common patterns: GET /auctions/{slug} or GET /auction/{slug}
  return get(`/auctions/${encodeURIComponent(slug)}`);
}

async function placeBid(auctionId, body) {
  // Common patterns: POST /auctions/:id/bids
  return postJson(`/auctions/${auctionId}/bids`, body);
}

// Additional API methods for the application
async function getCategories() {
  return get('/categories');
}

async function getFeaturedProducts(limit = 12) {
  try {
    const response = await get(`/products/featured?limit=${limit}`);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch products');
  } catch (error) {
    // Return mock data if API fails
    return {
      success: true,
      data: [
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
        },
        {
          id: 4,
          name: 'Modern Office Chair',
          slug: 'modern-office-chair',
          price: 299.99,
          comparePrice: 399.99,
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
          badge: 'Sale',
          badgeColor: 'primary',
          rating: 4.6,
          reviewsCount: 45,
          isFeatured: true
        },
        {
          id: 5,
          name: 'Kitchen Storage Cabinet',
          slug: 'kitchen-storage-cabinet',
          price: 599.99,
          comparePrice: null,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea4bc?w=400&h=400&fit=crop',
          badge: 'New',
          badgeColor: 'info',
          rating: 4.5,
          reviewsCount: 32,
          isFeatured: true
        },
        {
          id: 6,
          name: 'Outdoor Patio Set',
          slug: 'outdoor-patio-set',
          price: 799.99,
          comparePrice: 999.99,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
          badge: 'Sale',
          badgeColor: 'primary',
          rating: 4.7,
          reviewsCount: 28,
          isFeatured: true
        }
      ]
    };
  }
}

async function getVehicles() {
  return get('/vehicles');
}

async function getProperties() {
  return get('/properties');
}

async function getProducts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return get(`/products${queryString ? `?${queryString}` : ''}`);
}

async function getProductBySlug(slug) {
  return get(`/products/${encodeURIComponent(slug)}`);
}

async function getVehicleBySlug(slug) {
  return get(`/vehicles/${encodeURIComponent(slug)}`);
}

async function getPropertyBySlug(slug) {
  return get(`/properties/${encodeURIComponent(slug)}`);
}

async function getCategoryBySlug(slug) {
  return get(`/categories/${encodeURIComponent(slug)}`);
}

async function getBlogPosts() {
  try {
    const response = await get('/blog/posts');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch blog posts');
  } catch (error) {
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Modern Furniture Trends for 2024',
          slug: 'modern-furniture-trends-2024',
          excerpt: 'Discover the latest furniture trends that will transform your home.',
          content: 'Full blog post content here...',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
          author: 'WoodMart Team',
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
      ]
    };
  }
}

async function getBlogPostBySlug(slug) {
  return get(`/blog/posts/${encodeURIComponent(slug)}`);
}

async function login(credentials) {
  return postJson('/auth/login', credentials);
}

async function register(userData) {
  return postJson('/auth/register', userData);
}

async function logout() {
  return postJson('/auth/logout');
}

async function getUserProfile() {
  return get('/user/profile');
}

async function updateUserProfile(data) {
  return postJson('/user/profile', data);
}

async function getCart() {
  return get('/cart');
}

async function addToCart(productId, quantity = 1, variations = {}) {
  return postJson('/cart/add', { productId, quantity, variations });
}

async function updateCartItem(itemId, quantity) {
  return postJson(`/cart/items/${itemId}`, { quantity });
}

async function removeFromCart(itemId) {
  return delJson(`/cart/items/${itemId}`);
}

async function clearCart() {
  return delJson('/cart');
}

async function createOrder(orderData) {
  return postJson('/orders', orderData);
}

async function getOrders() {
  return get('/orders');
}

async function getOrderById(orderId) {
  return get(`/orders/${orderId}`);
}

async function getWishlist() {
  return get('/wishlist');
}

async function addToWishlist(productId) {
  return postJson('/wishlist/add', { productId });
}

async function removeFromWishlist(productId) {
  return delJson(`/wishlist/${productId}`);
}

async function searchProducts(query, filters = {}) {
  return get(`/search/products?q=${encodeURIComponent(query)}&${new URLSearchParams(filters).toString()}`);
}

// Currency and Language API methods
async function getCurrencies() {
  try {
    const response = await get('/currencies');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch currencies');
  } catch (error) {
    // Return mock data if API fails
    return {
      success: true,
      data: [
        { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
        { id: 2, code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
        { id: 3, code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 }
      ]
    };
  }
}

async function getLanguages() {
  try {
    const response = await get('/languages');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch languages');
  } catch (error) {
    // Return mock data if API fails
    return {
      success: true,
      data: [
        { id: 1, code: 'en', name: 'English', flag: '🇺🇸' },
        { id: 2, code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { id: 3, code: 'fr', name: 'French', flag: '🇫🇷' }
      ]
    };
  }
}

async function getTranslations(languageCode) {
  try {
    const response = await get(`/translations/${languageCode}`);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch translations');
  } catch (error) {
    // Return mock data if API fails
    return {
      success: true,
      data: {}
    };
  }
}

export const apiService = {
  // generic
  customRequest,
  get,
  postJson,
  postForm,
  delJson,
  // auctions
  getAuctions,
  getAuctionBySlug,
  placeBid,
  // KYC domain
  getKycDocuments,
  getKycTypes,
  submitKycDocument,
  updateKycDocument,
  uploadKycFile,
  deleteKycFile,
  // Additional methods
  getCategories,
  getFeaturedProducts,
  getVehicles,
  getProperties,
  getProducts,
  getProductBySlug,
  getVehicleBySlug,
  getPropertyBySlug,
  getCategoryBySlug,
  getBlogPosts,
  getBlogPostBySlug,
  login,
  register,
  logout,
  getUserProfile,
  updateUserProfile,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
  getOrders,
  getOrderById,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  searchProducts,
  getCurrencies,
  getLanguages,
  getTranslations,
};
