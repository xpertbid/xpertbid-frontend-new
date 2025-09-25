import { 
  Product, 
  Category, 
  ApiResponse, 
  PaymentGateway, 
  Auction, 
  Property, 
  Vehicle, 
  BlogPost, 
  Bid, 
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  BidFormData,
  User,
  Currency,
  Language,
  Translation,
  CurrencyConversion,
  Vendor,
  VendorRegistrationData,
  VendorStats,
  KycDocument,
  KycDocumentFormData,
  KycTypeInfo,
  Order,
  // OrderItem,
  // WishlistItem,
  // CartItem,
  CartApiItem
} from '@/types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';





class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage for authenticated requests
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products - Using Laravel API endpoints
  async getProducts(params?: { type?: string; limit?: number; featured?: boolean }): Promise<ApiResponse<Product[]>> {
    let url = '/products';
    if (params?.limit) {
      url += `?limit=${params.limit}`;
    }
    if (params?.featured) {
      url += `${params.limit ? '&' : '?'}featured=1`;
    }
    return this.request<ApiResponse<Product[]>>(url);
  }

  async searchProducts(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice.toString());
      if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString());
      if (filters.sortBy) params.append('sort_by', filters.sortBy);
      if (filters.sortOrder) params.append('sort_order', filters.sortOrder);
    }
    
    return this.request<ApiResponse<Product[]>>(`/cached/products/search?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/products/${id}`);
  }

  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>(`/products?featured=1&limit=${limit}`);
  }

  // Categories - Using Laravel API endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>('/categories');
  }

  // Currency methods
  async getCurrencies(): Promise<ApiResponse<Currency[]>> {
    return this.request<ApiResponse<Currency[]>>('/currencies');
  }

  async getDefaultCurrency(): Promise<ApiResponse<Currency>> {
    return this.request<ApiResponse<Currency>>('/currencies/default');
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<ApiResponse<CurrencyConversion>> {
    return this.request<ApiResponse<CurrencyConversion>>('/currencies/convert', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency
      }),
    });
  }

  // Language methods
  async getLanguages(): Promise<ApiResponse<Language[]>> {
    return this.request<ApiResponse<Language[]>>('/languages');
  }

  async getDefaultLanguage(): Promise<ApiResponse<Language>> {
    return this.request<ApiResponse<Language>>('/languages/default');
  }

  async getTranslations(language: string): Promise<ApiResponse<Translation>> {
    return this.request<ApiResponse<Translation>>(`/translations/${language}`);
  }

  async translateText(text: string, fromLanguage: string, toLanguage: string): Promise<ApiResponse<{
    original_text: string;
    translated_text: string;
    from_language: string;
    to_language: string;
  }>> {
    return this.request<ApiResponse<{
      original_text: string;
      translated_text: string;
      from_language: string;
      to_language: string;
    }>>('/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        from_language: fromLanguage,
        to_language: toLanguage
      }),
    });
  }

  // Wishlist methods
  async getWishlist(): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>('/wishlist');
  }

  async addToWishlist(productId: string): Promise<ApiResponse<{
    wishlist_id: number;
    product_id: string;
  }>> {
    return this.request<ApiResponse<{
      wishlist_id: number;
      product_id: string;
    }>>('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>('/wishlist/remove', {
      method: 'DELETE',
      body: JSON.stringify({ product_id: productId }),
    });
  }

  async checkWishlistStatus(productId: string): Promise<ApiResponse<{
    product_id: string;
    in_wishlist: boolean;
  }>> {
    return this.request<ApiResponse<{
      product_id: string;
      in_wishlist: boolean;
    }>>(`/wishlist/check/${productId}`);
  }

  async clearWishlist(): Promise<ApiResponse<{
    deleted_count: number;
  }>> {
    return this.request<ApiResponse<{
      deleted_count: number;
    }>>('/wishlist/clear', {
      method: 'DELETE',
    });
  }

  // User Dashboard methods
  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<ApiResponse<Order[]>>('/user/orders');
  }

  async getUserBids(): Promise<ApiResponse<Bid[]>> {
    return this.request<ApiResponse<Bid[]>>('/user/bids');
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/user/profile');
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword
      }),
    });
  }

  // Vendor methods
  async registerVendor(data: VendorRegistrationData): Promise<ApiResponse<Vendor>> {
    return this.request<ApiResponse<Vendor>>('/vendor/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVendorProfile(): Promise<ApiResponse<Vendor>> {
    return this.request<ApiResponse<Vendor>>('/vendor/profile');
  }

  async updateVendorProfile(data: Partial<Vendor>): Promise<ApiResponse<Vendor>> {
    return this.request<ApiResponse<Vendor>>('/vendor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getVendorStats(): Promise<ApiResponse<VendorStats>> {
    return this.request<ApiResponse<VendorStats>>('/vendor/stats');
  }

  async getVendorProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>('/vendor/products');
  }

  async getVendorOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<ApiResponse<Order[]>>('/vendor/orders');
  }

  async getVendorDashboard(): Promise<ApiResponse<{
    stats: VendorStats;
    recent_orders: Order[];
    low_stock_products: Product[];
    top_products: Product[];
  }>> {
    return this.request<ApiResponse<{
      stats: VendorStats;
      recent_orders: Order[];
      low_stock_products: Product[];
      top_products: Product[];
    }>>('/vendor/dashboard');
  }

  // KYC Document methods
  async getKycTypes(): Promise<ApiResponse<{ [key: string]: KycTypeInfo }>> {
    return this.request<ApiResponse<{ [key: string]: KycTypeInfo }>>('/kyc-types');
  }

  async getKycDocuments(): Promise<ApiResponse<KycDocument[]>> {
    return this.request<ApiResponse<KycDocument[]>>('/kyc-documents');
  }

  async getKycDocument(id: number): Promise<ApiResponse<KycDocument>> {
    return this.request<ApiResponse<KycDocument>>(`/kyc-documents/${id}`);
  }

  async submitKycDocument(data: KycDocumentFormData): Promise<ApiResponse<KycDocument>> {
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
      if (key === 'documents' && data.documents) {
        // Handle file uploads
        data.documents.forEach((file, index) => {
          formData.append(`documents[${index}]`, file);
        });
      } else if (data[key as keyof KycDocumentFormData] !== undefined) {
        formData.append(key, data[key as keyof KycDocumentFormData] as string);
      }
    });

    return this.request<ApiResponse<KycDocument>>('/kyc-documents', {
      method: 'POST',
      body: formData,
    });
  }

  async updateKycDocument(id: number, data: Partial<KycDocumentFormData>): Promise<ApiResponse<KycDocument>> {
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
      if (key === 'documents' && data.documents) {
        // Handle file uploads
        data.documents.forEach((file, index) => {
          formData.append(`documents[${index}]`, file);
        });
      } else if (data[key as keyof KycDocumentFormData] !== undefined) {
        formData.append(key, data[key as keyof KycDocumentFormData] as string);
      }
    });

    return this.request<ApiResponse<KycDocument>>(`/kyc-documents/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteKycDocument(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/kyc-documents/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<ApiResponse<Category>>(`/categories/${id}`);
  }

  async getProductsByCategory(categoryId: string, limit?: number): Promise<ApiResponse<Product[]>> {
    let url = `/products?category_id=${categoryId}`;
    if (limit) {
      url += `&limit=${limit}`;
    }
    return this.request<ApiResponse<Product[]>>(url);
  }

  // Additional endpoints for XpertBid features
  async getAuctions(): Promise<ApiResponse<Auction[]>> {
    return this.request<ApiResponse<Auction[]>>('/auctions');
  }

  async getProperties(): Promise<ApiResponse<Property[]>> {
    return this.request<ApiResponse<Property[]>>('/properties');
  }

  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return this.request<ApiResponse<Property>>(`/properties/${id}`);
  }

  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    return this.request<ApiResponse<Vehicle[]>>('/vehicles');
  }

  async getVehicle(id: string): Promise<ApiResponse<Vehicle>> {
    return this.request<ApiResponse<Vehicle>>(`/vehicles/${id}`);
  }

  async getBrands(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>('/brands');
  }

  async getBlogPosts(): Promise<ApiResponse<BlogPost[]>> {
    return this.request<ApiResponse<BlogPost[]>>('/blog-posts');
  }

  // Bid placement
  async placeBid(auctionId: number, bidData: BidFormData): Promise<ApiResponse<Bid>> {
    return this.request<ApiResponse<Bid>>(`/auctions/${auctionId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  // Get user bidding history
  async getUserBidsByEmail(email: string): Promise<ApiResponse<Bid[]>> {
    return this.request<ApiResponse<Bid[]>>(`/user/${email}/bids`);
  }

  // Get available payment gateways
  async getPaymentGateways(): Promise<ApiResponse<PaymentGateway[]>> {
    return this.request<ApiResponse<PaymentGateway[]>>('/payment-gateways');
  }

  // Process payment
  async processPayment(paymentData: {
    gateway_id: number;
    amount: number;
    currency: string;
    payment_data: Record<string, unknown>;
    order_id?: number;
    customer_id?: number;
  }): Promise<ApiResponse<{ transaction_id: string; status: string; message: string }>> {
    return this.request<ApiResponse<{ transaction_id: string; status: string; message: string }>>('/payment/process', {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: 1, // Default tenant for now
        ...paymentData
      }),
    });
  }

  // Authentication methods
  async login(credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<ApiResponse<AuthResponse>>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<ApiResponse<AuthResponse>>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>('/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/user');
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/user');
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<ApiResponse<{ token: string }>>('/refresh', {
      method: 'POST',
    });
  }

  // Social authentication
  async socialLogin(userData: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: 'google' | 'facebook';
    access_token: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<ApiResponse<AuthResponse>>('/auth/social-login', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Get Google OAuth redirect URL
  async getGoogleRedirectUrl(): Promise<ApiResponse<{ redirect_url: string }>> {
    return this.request<ApiResponse<{ redirect_url: string }>>('/auth/google/redirect');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; service: string; version: string }>> {
    return this.request<ApiResponse<{ status: string; timestamp: string; service: string; version: string }>>('/health');
  }

  // Cart operations
  async getCart(sessionId: string): Promise<ApiResponse<CartApiItem[]>> {
    return this.request<ApiResponse<CartApiItem[]>>(`/cart/${sessionId}`);
  }

  async addToCart(sessionId: string, productId: number, quantity: number = 1, variations?: Record<string, unknown>): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/cart/${sessionId}/add`, {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        variations: variations || {}
      }),
    });
  }

  async updateCartItem(sessionId: string, itemId: number, quantity: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/cart/${sessionId}/update`, {
      method: 'PUT',
      body: JSON.stringify({
        item_id: itemId,
        quantity
      }),
    });
  }

  async removeFromCart(sessionId: string, itemId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/cart/${sessionId}/remove`, {
      method: 'DELETE',
      body: JSON.stringify({
        item_id: itemId
      }),
    });
  }

  async clearCart(sessionId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>(`/cart/${sessionId}/clear`, {
      method: 'DELETE',
    });
  }

  // Custom request method for additional endpoints
  async customRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }
}

export const apiService = new ApiService();
export default apiService;