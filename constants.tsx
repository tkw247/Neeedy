import { Product, ProductCategory, Category, Slider, Campaign, Review, LandingPage } from './types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Gadget', status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800' },
  { id: 'cat3', name: 'Smart Home', status: 'active', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800' },
  { id: 'cat6', name: 'Fashion', status: 'active', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800' },
];

export const MOCK_SLIDERS: Slider[] = [
  {
    id: 's1',
    slides: [
      {
        id: 'slide-1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000',
        title: 'Neeedy Innovation',
        subtitle: 'Explore the latest in smart watches and tech solutions.',
        buttonText: 'Shop Now',
        link: '/shop'
      }
    ],
    settings: { transitionType: 'fade', speed: 5000 },
    status: 'active'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'g1',
    name: 'Aether Pods Pro',
    description: 'Immersive sound experience with active noise cancellation and spatial audio support.',
    price: 30250,
    regularPrice: 32500,
    sku: 'AE-POD-PRO',
    category: 'cat1',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'],
    rating: 4.8,
    reviewsCount: 1250,
    stock: 45,
    isFeatured: true,
    salesCount: 150,
  },
  {
    id: 'g2',
    name: 'Sonic Buds X2',
    description: 'Ultra-lightweight TWS with 40-hour battery life and gaming low-latency mode.',
    price: 4950,
    regularPrice: 5800,
    sku: 'SONIC-X2',
    category: 'cat1',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2000'],
    rating: 4.7,
    reviewsCount: 210,
    stock: 30,
    isFeatured: true,
    salesCount: 85,
  },
  {
    id: 'g3',
    name: 'Volt-Charge 65W GaN',
    description: 'High-speed PD wall charger. Compact design, safely charges laptops and phones.',
    price: 3080,
    regularPrice: 3800,
    sku: 'VOLT-65W',
    category: 'cat1',
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800'],
    rating: 4.6,
    reviewsCount: 180,
    stock: 100,
    isFeatured: false,
    salesCount: 320,
  }
];
