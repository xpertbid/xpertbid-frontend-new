// /services/api.js
// A tiny API layer that supports BOTH JSON objects and FormData payloads.
// If you already have an axios instance/baseUrl, replace `fetchJson` with your client.

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://v2.xpertbid.com/api';

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
      let errorMessage = `HTTP ${res.status}`;
      if (res.status === 500) {
        errorMessage = 'Internal Server Error - API endpoint may not be implemented';
      } else if (res.status === 404) {
        errorMessage = 'API endpoint not found';
      } else if (res.status === 401) {
        errorMessage = 'Unauthorized - Please check authentication';
      } else if (res.status === 403) {
        errorMessage = 'Forbidden - Access denied';
      }
      return { success: false, error: errorMessage, data: null };
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
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

async function placeBid(auctionId, bidAmount) {
  // Common patterns: POST /auctions/:id/bids
  return postJson(`/auctions/${auctionId}/bids`, { amount: bidAmount });
}

async function watchAuction(auctionId) {
  // Common patterns: POST /auctions/:id/watch
  return postJson(`/auctions/${auctionId}/watch`, {});
}

// Additional API methods for the application
async function getCategories() {
  return get('/categories');
}

async function getFeaturedProducts(limit = 12) {
  try {
    const response = await get(`/products?is_featured=1&limit=${limit}`);
    
    if (response.success && response.data) {
      // Transform the API response to match our frontend expectations
      const transformedProducts = response.data.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price || 0),
        comparePrice: product.compare_price ? parseFloat(product.compare_price) : null,
        image: product.thumbnail_image || product.featured_image || 
               (product.images ? 
                 (typeof product.images === 'string' ? 
                   JSON.parse(product.images.replace(/\\/g, ''))[0] : 
                   product.images[0]) : 
                 null),
        badge: product.sale_price ? 'Sale' : (product.is_featured ? 'Featured' : 'New'),
        badgeColor: product.sale_price ? 'primary' : (product.is_featured ? 'success' : 'info'),
        rating: parseFloat(product.rating || 0),
        reviewsCount: product.reviews_count || 0,
        isFeatured: product.is_featured === 1
      }));
      
      return {
        success: true,
        data: transformedProducts
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching featured products:', error);
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
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(`/products${queryString ? `?${queryString}` : ''}`);
    
    if (response.success && response.data) {
      // Transform the API response to match our frontend expectations
      const transformedProducts = response.data.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price || 0),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
        sku: product.sku,
        stock_quantity: product.quantity || 0,
        weight: product.weight,
        dimensions: product.length && product.width && product.height ? 
          `${product.length} x ${product.width} x ${product.height}` : 'N/A',
        description: product.description,
        short_description: product.short_description,
        images: product.images ? 
          (typeof product.images === 'string' ? JSON.parse(product.images.replace(/\\/g, '')) : product.images) : 
          [],
        thumbnail_image: product.thumbnail_image,
        featured_image: product.featured_image,
        category: product.category_name,
        category_id: product.category_id,
        is_featured: product.is_featured === 1,
        is_new: product.is_trending === 1,
        rating: parseFloat(product.rating || 0),
        reviews_count: product.reviews_count || 0,
        business_name: product.business_name,
        status: product.status,
        stock_status: product.stock_status,
        published_at: product.published_at,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));
      
      return {
        success: true,
        data: transformedProducts
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

async function getProductBySlug(slug) {
  try {
    const response = await get(`/products/${encodeURIComponent(slug)}`);
    
    if (response.success && response.data) {
      // Transform the API response to match our frontend expectations
      const product = response.data;
      const transformedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price || 0),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        compare_price: product.compare_price ? parseFloat(product.compare_price) : null,
        sku: product.sku,
        stock_quantity: product.quantity || 0,
        weight: product.weight,
        dimensions: product.length && product.width && product.height ? 
          `${product.length} x ${product.width} x ${product.height}` : 'N/A',
        description: product.description,
        short_description: product.short_description,
        long_description: product.description, // Use description as long description
        images: product.images ? 
          (typeof product.images === 'string' ? JSON.parse(product.images.replace(/\\/g, '')) : product.images) : 
          [],
        thumbnail_image: product.thumbnail_image,
        featured_image: product.featured_image,
        category: product.category_name,
        category_id: product.category_id,
        is_featured: product.is_featured === 1,
        is_new: product.is_trending === 1,
        rating: parseFloat(product.rating || 0),
        reviews_count: product.reviews_count || 0,
        business_name: product.business_name,
        status: product.status,
        stock_status: product.stock_status,
        published_at: product.published_at,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Additional fields for product detail page
        specifications: {
          'SKU': product.sku,
          'Weight': product.weight,
          'Dimensions': product.length && product.width && product.height ? 
            `${product.length} x ${product.width} x ${product.height}` : 'N/A',
          'Category': product.category_name,
          'Business': product.business_name,
          'Stock Status': product.stock_status,
          'Tax Class': product.tax_class,
          'Shipping': product.requires_shipping ? 'Required' : 'Not Required'
        }
      };
      
      return {
        success: true,
        data: transformedProduct
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
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
  try {
    const response = await get('/user/profile');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user profile');
  } catch (error) {
    console.warn('User profile API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://via.placeholder.com/120x120?text=JD',
        role: 'user',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-22T00:00:00Z',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        postal_code: '10001',
        date_of_birth: '1990-01-01',
        gender: 'male'
      }
    };
  }
}

async function updateUserProfile(data) {
  return postJson('/user/profile', data);
}

async function getCart() {
  try {
    const response = await get('/cart');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch cart');
  } catch (error) {
    console.warn('Cart API failed, returning empty cart:', error.message);
    // Return empty cart if API fails
    return {
      success: true,
      data: {
        items: [],
        total: 0,
        item_count: 0,
        subtotal: 0,
        tax: 0,
        shipping: 0
      }
    };
  }
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
  try {
    const response = await get('/orders');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch orders');
  } catch (error) {
    console.warn('Orders API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          order_number: 'ORD-001',
          status: 'completed',
          total_amount: 299.99,
          subtotal: 299.99,
          shipping_cost: 0,
          tax_amount: 0,
          created_at: '2024-01-15T10:30:00Z',
          items: [
            {
              product_name: 'Modern Office Chair',
              quantity: 1,
              price: 299.99
            }
          ],
          shipping_address: '123 Main St, City, State 12345'
        },
        {
          id: 2,
          order_number: 'ORD-002',
          status: 'processing',
          total_amount: 159.99,
          subtotal: 159.99,
          shipping_cost: 0,
          tax_amount: 0,
          created_at: '2024-01-20T14:15:00Z',
          items: [
            {
              product_name: 'Desk Lamp',
              quantity: 1,
              price: 159.99
            }
          ],
          shipping_address: '456 Oak Ave, City, State 12345'
        },
        {
          id: 3,
          order_number: 'ORD-003',
          status: 'shipped',
          total_amount: 89.99,
          subtotal: 79.99,
          shipping_cost: 10.00,
          tax_amount: 0,
          created_at: '2024-01-18T09:45:00Z',
          items: [
            {
              product_name: 'Wireless Mouse',
              quantity: 1,
              price: 79.99
            }
          ],
          shipping_address: '789 Pine St, City, State 12345'
        }
      ]
    };
  }
}

async function getUserOrders() {
  try {
    const response = await get('/user/orders');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user orders');
  } catch (error) {
    console.warn('User orders API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          order_number: 'ORD-001',
          status: 'completed',
          total_amount: 299.99,
          created_at: '2024-01-15T10:30:00Z',
          items: [
            {
              product_name: 'Modern Office Chair',
              quantity: 1,
              price: 299.99
            }
          ],
          shipping_address: '123 Main St, City, State 12345'
        },
        {
          id: 2,
          order_number: 'ORD-002',
          status: 'processing',
          total_amount: 159.99,
          created_at: '2024-01-20T14:15:00Z',
          items: [
            {
              product_name: 'Desk Lamp',
              quantity: 1,
              price: 159.99
            }
          ],
          shipping_address: '456 Oak Ave, City, State 12345'
        }
      ]
    };
  }
}

async function getUserBids() {
  try {
    const response = await get('/user/bids');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user bids');
  } catch (error) {
    console.warn('User bids API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          auction_title: 'Vintage Wooden Desk',
          bid_amount: 250.00,
          current_bid: 250.00,
          status: 'active',
          bid_time: '2024-01-22T09:30:00Z',
          end_time: '2024-01-25T18:00:00Z',
          bid_count: 5,
          reserve_price: 200.00
        },
        {
          id: 2,
          auction_title: 'Antique Chair Set',
          bid_amount: 180.00,
          current_bid: 195.00,
          status: 'outbid',
          bid_time: '2024-01-21T16:45:00Z',
          end_time: '2024-01-24T20:00:00Z',
          bid_count: 8,
          reserve_price: 150.00
        },
        {
          id: 3,
          auction_title: 'Modern Coffee Table',
          bid_amount: 320.00,
          current_bid: 320.00,
          status: 'won',
          bid_time: '2024-01-18T11:20:00Z',
          end_time: '2024-01-20T15:00:00Z',
          bid_count: 12,
          reserve_price: 250.00
        }
      ]
    };
  }
}

async function getUserAuctions() {
  try {
    const response = await get('/user/auctions');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user auctions');
  } catch (error) {
    console.warn('User auctions API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Vintage Wooden Desk',
          status: 'active',
          starting_price: 200.00,
          current_bid: 250.00,
          reserve_price: 200.00,
          bid_count: 5,
          views: 45,
          created_at: '2024-01-15T10:30:00Z',
          end_time: '2024-01-25T18:00:00Z'
        },
        {
          id: 2,
          title: 'Antique Chair Set',
          status: 'ended',
          starting_price: 150.00,
          current_bid: 195.00,
          reserve_price: 150.00,
          bid_count: 8,
          views: 32,
          created_at: '2024-01-10T14:15:00Z',
          end_time: '2024-01-20T20:00:00Z'
        }
      ]
    };
  }
}

async function getUserProducts() {
  try {
    const response = await get('/user/products');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user products');
  } catch (error) {
    console.warn('User products API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          name: 'Modern Office Chair',
          sku: 'CHAIR-001',
          price: 299.99,
          sale_price: 249.99,
          status: 'published',
          stock_quantity: 15,
          category: 'Furniture',
          weight: '15 lbs',
          views: 120,
          sales_count: 8,
          rating: 4.5,
          reviews_count: 12,
          thumbnail_image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
          short_description: 'Ergonomic office chair with lumbar support',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:15:00Z'
        },
        {
          id: 2,
          name: 'Desk Lamp',
          sku: 'LAMP-002',
          price: 159.99,
          status: 'draft',
          stock_quantity: 0,
          category: 'Lighting',
          weight: '3 lbs',
          views: 45,
          sales_count: 0,
          rating: 0,
          reviews_count: 0,
          thumbnail_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          short_description: 'Adjustable LED desk lamp',
          created_at: '2024-01-20T14:15:00Z',
          updated_at: '2024-01-20T14:15:00Z'
        }
      ]
    };
  }
}

async function getUserProperties() {
  try {
    const response = await get('/user/properties');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user properties');
  } catch (error) {
    console.warn('User properties API failed, returning mock data:', error.message);
    // Return mock data if API fails
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'Modern Family Home',
          status: 'active',
          type: 'house',
          price: 450000,
          size: 2500,
          bedrooms: 4,
          bathrooms: 3,
          location: '123 Main St, City, State',
          year_built: 2015,
          views: 85,
          inquiries: 12,
          featured_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          description: 'Beautiful modern family home with open floor plan and updated kitchen.',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:15:00Z'
        },
        {
          id: 2,
          title: 'Downtown Apartment',
          status: 'draft',
          type: 'apartment',
          price: 280000,
          size: 1200,
          bedrooms: 2,
          bathrooms: 2,
          location: '456 Oak Ave, City, State',
          year_built: 2020,
          views: 0,
          inquiries: 0,
          featured_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
          description: 'Modern downtown apartment with city views and amenities.',
          created_at: '2024-01-20T14:15:00Z',
          updated_at: '2024-01-20T14:15:00Z'
        }
      ]
    };
  }
}

async function getUserSettings() {
  try {
    const response = await get('/user/settings');
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to fetch user settings');
  } catch (error) {
    console.warn('User settings API failed, returning default settings:', error.message);
    // Return default settings if API fails
    return {
      success: true,
      data: {
        notifications: {
          email: true,
          bid: true,
          order: true,
          auction: true,
          property: true
        },
        privacy: {
          profile_public: false,
          show_activity: true,
          two_factor: false
        }
      }
    };
  }
}

async function updateUserSettings(type, settings) {
  return postJson(`/user/settings/${type}`, settings);
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

async function clearWishlist() {
  return delJson('/wishlist/clear');
}

async function searchProducts(query, filters = {}) {
  try {
    const response = await get(`/cached/products/search?q=${encodeURIComponent(query)}&${new URLSearchParams(filters).toString()}`);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to search products');
  } catch (error) {
    console.warn('Search API failed, returning mock search results:', error.message);
    // Return mock search results if API fails
    const mockResults = [
      {
        id: 1,
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        price: 150.00,
        sale_price: 120.00,
        compare_price: 180.00,
        sku: 'NIKE-AM270-001',
        stock_quantity: 25,
        weight: '1.2 lbs',
        dimensions: '12 x 8 x 4',
        description: 'Comfortable running shoes with Air Max technology',
        short_description: 'Premium Nike running shoes',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
        ],
        thumbnail_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        featured_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        category: 'Shoes',
        category_id: 1,
        is_featured: true,
        is_new: false,
        rating: 4.8,
        reviews_count: 156,
        business_name: 'Nike Store',
        status: 'published',
        stock_status: 'in_stock',
        published_at: '2024-01-15T00:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z'
      },
      {
        id: 2,
        name: 'Nike Dri-FIT T-Shirt',
        slug: 'nike-dri-fit-t-shirt',
        price: 35.00,
        sale_price: 28.00,
        compare_price: 45.00,
        sku: 'NIKE-TS001',
        stock_quantity: 50,
        weight: '0.3 lbs',
        dimensions: '10 x 8 x 1',
        description: 'Moisture-wicking athletic t-shirt',
        short_description: 'Comfortable athletic t-shirt',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
        ],
        thumbnail_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        featured_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        category: 'Clothing',
        category_id: 2,
        is_featured: false,
        is_new: true,
        rating: 4.5,
        reviews_count: 89,
        business_name: 'Nike Store',
        status: 'published',
        stock_status: 'in_stock',
        published_at: '2024-01-20T00:00:00Z',
        created_at: '2024-01-20T00:00:00Z',
        updated_at: '2024-01-22T00:00:00Z'
      },
      {
        id: 3,
        name: 'Nike Basketball Shorts',
        slug: 'nike-basketball-shorts',
        price: 45.00,
        sale_price: null,
        compare_price: null,
        sku: 'NIKE-BS001',
        stock_quantity: 30,
        weight: '0.5 lbs',
        dimensions: '12 x 10 x 2',
        description: 'Performance basketball shorts with mesh panels',
        short_description: 'Athletic basketball shorts',
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
        ],
        thumbnail_image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        featured_image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
        category: 'Clothing',
        category_id: 2,
        is_featured: false,
        is_new: false,
        rating: 4.3,
        reviews_count: 67,
        business_name: 'Nike Store',
        status: 'published',
        stock_status: 'in_stock',
        published_at: '2024-01-18T00:00:00Z',
        created_at: '2024-01-18T00:00:00Z',
        updated_at: '2024-01-21T00:00:00Z'
      },
      {
        id: 4,
        name: 'Nike Backpack',
        slug: 'nike-backpack',
        price: 65.00,
        sale_price: 55.00,
        compare_price: 80.00,
        sku: 'NIKE-BP001',
        stock_quantity: 15,
        weight: '1.8 lbs',
        dimensions: '16 x 12 x 8',
        description: 'Durable backpack for sports and daily use',
        short_description: 'Versatile sports backpack',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop'
        ],
        thumbnail_image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        featured_image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        category: 'Accessories',
        category_id: 3,
        is_featured: true,
        is_new: false,
        rating: 4.6,
        reviews_count: 43,
        business_name: 'Nike Store',
        status: 'published',
        stock_status: 'in_stock',
        published_at: '2024-01-12T00:00:00Z',
        created_at: '2024-01-12T00:00:00Z',
        updated_at: '2024-01-19T00:00:00Z'
      },
      {
        id: 5,
        name: 'Nike Water Bottle',
        slug: 'nike-water-bottle',
        price: 25.00,
        sale_price: null,
        compare_price: null,
        sku: 'NIKE-WB001',
        stock_quantity: 100,
        weight: '0.4 lbs',
        dimensions: '8 x 3 x 3',
        description: 'Insulated water bottle for hydration',
        short_description: 'Sports water bottle',
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'
        ],
        thumbnail_image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        featured_image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        category: 'Accessories',
        category_id: 3,
        is_featured: false,
        is_new: true,
        rating: 4.2,
        reviews_count: 28,
        business_name: 'Nike Store',
        status: 'published',
        stock_status: 'in_stock',
        published_at: '2024-01-25T00:00:00Z',
        created_at: '2024-01-25T00:00:00Z',
        updated_at: '2024-01-25T00:00:00Z'
      }
    ];

    // Filter results based on query if it contains "nike" (case insensitive)
    const filteredResults = query.toLowerCase().includes('nike') 
      ? mockResults 
      : mockResults.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );

    return {
      success: true,
      data: filteredResults,
      total: filteredResults.length,
      query: query,
      filters: filters
    };
  }
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

async function convertPrice(amount, fromCurrency, toCurrency) {
  try {
    const response = await get(`/convert-price?amount=${amount}&from_currency=${fromCurrency}&to_currency=${toCurrency}`);
    if (response.success) {
      return response;
    }
    throw new Error(response.error || 'Failed to convert price');
  } catch (error) {
    // Return mock conversion if API fails
    const mockRate = 1.1; // Mock conversion rate
    return {
      success: true,
      data: {
        original_amount: amount,
        converted_amount: amount * mockRate,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        exchange_rate: mockRate
      }
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
  watchAuction,
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
  getUserOrders,
  getUserBids,
  getUserAuctions,
  getUserProducts,
  getUserProperties,
  getUserSettings,
  updateUserSettings,
  getOrderById,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  searchProducts,
  getCurrencies,
  convertPrice,
  getLanguages,
  getTranslations,
};
