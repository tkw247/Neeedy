
export enum ProductCategory {
  GADGET = 'Gadget',
  SMART_HOME = 'Smart Home',
  FASHION = 'Fashion'
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  parentId?: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  regularPrice: number;
  offerPrice?: number;
  sku: string;
  category: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  salesCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  customerDetails: {
    email: string;
    phone: string;
    address: string;
    fullName: string;
  };
  paymentMethod: 'card' | 'cod' | 'bkash';
  bkashReference?: string;
}

export interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

export interface SliderSettings {
  transitionType: 'slide' | 'fade';
  speed: number; // in ms
}

export interface Slider {
  id: string;
  slides: Slide[];
  settings: SliderSettings;
  status: 'active' | 'inactive';
}

export interface AbandonedCart {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  lastUpdated: string;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  sections: any[];
  seo: {
    title: string;
    description: string;
  };
  status: 'published' | 'draft';
}

export interface Campaign {
  id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  couponCode: string;
  status: 'active' | 'inactive';
  performance: {
    uses: number;
    revenue: number;
  };
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reply?: string;
}

export interface AppState {
  cart: CartItem[];
  user: User | null;
  products: Product[];
  isDarkMode: boolean;
  orders: Order[];
  sliders: Slider[];
  categories: Category[];
  abandonedCarts: AbandonedCart[];
  landingPages: LandingPage[];
  campaigns: Campaign[];
  reviews: Review[];
}
