// /services/api.js
// A tiny API layer that supports BOTH JSON objects and FormData payloads.
// If you already have an axios instance/baseUrl, replace `fetchJson` with your client.

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, '') || ''; // e.g. "https://admin.xpertbid.com/api"

// Basic helper; swap with axios if you prefer
async function fetchJson(url, init = {}) {
  const res = await fetch(url, init);
  // If your backend wraps responses, you may want to check status codes here, too
  return await res.json();
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
  return get(`/products/featured?limit=${limit}`);
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
  return get('/blog/posts');
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
};
