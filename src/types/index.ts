// Core Types
export interface User {
  id: number;
  name: string;
  email: string;
  tenant_id: number;
  phone?: string;
  status: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

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
  gallery: string | string[];
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

export interface Auction {
  id: number;
  slug: string;
  product_name: string;
  product_image: string;
  seller_name: string;
  current_bid: number;
  reserve_price: number;
  end_time: string;
  bid_count: number;
  status: string;
  description?: string;
  category_name?: string;
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  images: string[];
  features: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface Bid {
  id: number;
  auction_id: number;
  bidder_name: string;
  bidder_email: string;
  bid_amount: number;
  created_at: string;
}

export interface KycType {
  id: number;
  name: string;
  description: string;
  required_fields: string[];
  is_active: boolean;
}

export interface KycDocument {
  id: number;
  user_id: number;
  kyc_type_id: number;
  status: string;
  documents: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface BidFormData {
  bid_amount: number;
  bidder_name: string;
  bidder_email: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Filter Types
export interface ProductFilters {
  search: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  brand: string;
  color: string;
  size: string;
  status: string;
  featured: boolean;
  topRated: boolean;
}

export interface AuctionFilters {
  search: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  seller: string;
  status: string;
  timeLeft: string;
}

// Auth Types
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  tenant_id: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  token_type: string;
}

// Component Props Types
export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: number;
}

export interface AuctionGridProps {
  auctions: Auction[];
  loading?: boolean;
  columns?: number;
}

export interface CategoryGridProps {
  categories: Category[];
  loading?: boolean;
  columns?: number;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
