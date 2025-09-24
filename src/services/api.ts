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
  User
} from '@/types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';





class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    return this.request<ApiResponse<Vehicle[]>>('/vehicles');
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
  async getUserBids(email: string): Promise<ApiResponse<Bid[]>> {
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
    return this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<ApiResponse<{ message: string }>>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/user');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<ApiResponse<{ token: string }>>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; service: string; version: string }>> {
    return this.request<ApiResponse<{ status: string; timestamp: string; service: string; version: string }>>('/health');
  }

  // Custom request method for additional endpoints
  async customRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }
}

export const apiService = new ApiService();
export default apiService;