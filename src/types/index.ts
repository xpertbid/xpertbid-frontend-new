// Core Types
export interface User {
  id: number;
  name: string;
  email: string;
  tenant_id: number;
  phone?: string;
  status: string;
  avatar?: string;
  role?: 'ecommerce' | 'vendor' | 'bidder' | 'auction_seller' | 'property_buyer' | 'property_seller';
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
  images: string | string[];
  featured_image?: string;
  thumbnail_image?: string;
  business_name: string;
  category_name: string;
  brand_name?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: number;
  slug?: string;
  title: string;
  description: string;
  property_type: string;
  listing_type: string;
  price: number;
  rent_price?: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  lot_size?: number;
  year_built?: number;
  property_status: string;
  amenities?: string;
  facilities?: string;
  images?: string | string[];
  floor_plans?: string;
  virtual_tour?: string;
  is_featured: boolean;
  is_verified: boolean;
  commission_rate: number;
  min_offer_price?: number;
  max_offer_price?: number;
  starting_price?: number;
  reserve_price?: number;
  is_negotiable: boolean;
  offer_requirements?: string;
  offer_deadline?: string;
  show_price: boolean;
  vendor_name?: string;
  agent_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  tenant_id: number;
  parent_id?: number;
  level: number;
  path?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  banner_image?: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  status: number;
  language: string;
  translation_group?: string;
  seo_meta?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  canonical_url?: string;
  commission_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: number;
  title: string;
  description: string;
  vehicle_type: string;
  listing_type: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  mileage?: number;
  mileage_unit: string;
  color?: string;
  doors?: number;
  seats?: number;
  engine_size?: number;
  engine_power?: string;
  price: number;
  rent_price?: number;
  currency: string;
  condition: string;
  vehicle_status: string;
  vin_number?: string;
  registration_number?: string;
  registration_date?: string;
  insurance_expiry?: string;
  features?: string;
  images?: string | string[];
  documents?: string;
  is_featured: boolean;
  is_verified: boolean;
  commission_rate: number;
  min_offer_price?: number;
  max_offer_price?: number;
  starting_price?: number;
  reserve_price?: number;
  is_negotiable: boolean;
  offer_requirements?: string;
  offer_deadline?: string;
  show_price: boolean;
  vendor_name?: string;
  agent_name?: string;
  slug?: string;
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
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  image: string;
  slug: string;
  variations?: {
    size?: string;
    color?: string;
  };
  vendor: string;
  sku: string;
}

export interface Bid {
  id: number;
  auction_id: number;
  bidder_name: string;
  bidder_email: string;
  bid_amount: number;
  created_at: string;
  auction_status?: string;
  product_name?: string;
  product_image?: string;
}

export interface KycType {
  id: number;
  name: string;
  description: string;
  required_fields: string[];
  is_active: boolean;
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
  phone?: string;
  status: string;
  avatar?: string;
  role?: 'ecommerce' | 'vendor' | 'bidder' | 'auction_seller' | 'property_buyer' | 'property_seller';
  created_at: string;
  updated_at: string;
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

// Currency and Language Types
export interface Currency {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  symbol: string;
  symbol_position: 'before' | 'after';
  decimal_places: number;
  exchange_rate: number;
  is_active: boolean;
  is_default: boolean;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  native_name: string;
  direction: 'ltr' | 'rtl';
  is_active: boolean;
  is_default: boolean;
  flag_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  [key: string]: string;
}

export interface CurrencyConversion {
  original_amount: number;
  from_currency: string;
  to_currency: string;
  converted_amount: number;
  exchange_rate: number;
}

// Vendor Types
export interface Vendor {
  id: number;
  tenant_id: number;
  user_id: number;
  business_name: string;
  business_type: 'individual' | 'company';
  business_registration_number?: string;
  tax_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  store_name: string;
  store_slug: string;
  store_description?: string;
  store_logo?: string;
  store_banner?: string;
  store_theme?: string;
  store_policies?: string;
  seo_settings?: string;
  social_media?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  commission_rate: number;
  subscription_fee: number;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  verified: boolean;
  verification_documents?: string;
  verified_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorRegistrationData {
  business_name: string;
  business_type: 'individual' | 'company';
  business_registration_number?: string;
  tax_id?: string;
  store_name: string;
  store_slug: string;
  store_description?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
}

export interface VendorStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
  recent_orders: Order[];
  top_products: Product[];
}

// KYC Document Types
export interface KycDocument {
  id: number;
  user_id: number;
  kyc_type: 'user' | 'vendor' | 'property' | 'vehicle' | 'auction';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  business_name?: string;
  ntn_number?: string;
  business_registration_number?: string;
  business_address?: string;
  business_type?: string;
  tax_number?: string;
  property_type?: string;
  property_location?: string;
  property_size?: string;
  property_ownership?: string;
  property_description?: string;
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_vin?: string;
  vehicle_registration_number?: string;
  auction_type?: string;
  item_category?: string;
  item_description?: string;
  item_condition?: string;
  estimated_value?: string;
  documents?: string;
  additional_info?: string;
  rejection_reason?: string;
  admin_notes?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface KycDocumentFormData {
  kyc_type: 'user' | 'vendor' | 'property' | 'vehicle' | 'auction';
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  business_name?: string;
  ntn_number?: string;
  business_registration_number?: string;
  business_address?: string;
  business_type?: string;
  tax_number?: string;
  property_type?: string;
  property_location?: string;
  property_size?: string;
  property_ownership?: string;
  property_description?: string;
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_vin?: string;
  vehicle_registration_number?: string;
  auction_type?: string;
  item_category?: string;
  item_description?: string;
  item_condition?: string;
  estimated_value?: string;
  documents?: File[];
  additional_info?: string;
}

export interface KycTypeInfo {
  name: string;
  description: string;
  required_documents: string[];
  icon: string;
  color: string;
}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  payment_status: string;
  shipping_status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: string;
  billing_address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: number;
  total: number;
  variations?: Record<string, unknown>;
}

// Wishlist Item Type
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

// Cart API Response Types
export interface CartApiItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  sale_price?: number;
  quantity: number;
  variations?: string;
  images?: string;
  slug?: string;
  vendor?: string;
  sku?: string;
}