const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  sale_price?: number;
  sku: string;
  stock_quantity: number;
  stock_status: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  status: string;
  is_featured: boolean;
  gallery: string | string[]; // Can be either string (JSON) or array
  business_name: string;
  category_name: string;
  brand_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaymentGateway {
  id: number;
  name: string;
  code: string;
  type: string;
  description: string;
  logo_url?: string;
  transaction_fee: number;
  fixed_fee: number;
  supported_currencies: string[];
  supported_countries: string[];
  is_test_mode: boolean;
  sort_order: number;
}

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
  async getAuctions(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/auctions');
  }

  async getProperties(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/properties');
  }

  async getVehicles(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/vehicles');
  }

  async getBrands(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/brands');
  }

  async getBlogPosts(): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>('/blog-posts');
  }

  // Bid placement
  async placeBid(auctionId: number, bidData: { bid_amount: number; bidder_name: string; bidder_email: string }): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/auctions/${auctionId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  // Get user bidding history
  async getUserBids(email: string): Promise<ApiResponse<any[]>> {
    return this.request<ApiResponse<any[]>>(`/user/${email}/bids`);
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
    payment_data: any;
    order_id?: number;
    customer_id?: number;
  }): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/payment/process', {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: 1, // Default tenant for now
        ...paymentData
      }),
    });
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string; password_confirmation: string }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request<ApiResponse<{ user: any; token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/auth/user');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<ApiResponse<{ token: string }>>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; service: string; version: string }>> {
    return this.request<ApiResponse<any>>('/health');
  }

  // Custom request method for additional endpoints
  async customRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }
}

export const apiService = new ApiService();
export default apiService;