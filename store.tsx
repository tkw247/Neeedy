
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Order, Category, Slider, AbandonedCart, LandingPage, Campaign, Review } from './types';

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  products: Product[];
  orders: Order[];
  sliders: Slider[];
  categories: Category[];
  abandonedCarts: AbandonedCart[];
  landingPages: LandingPage[];
  campaigns: Campaign[];
  reviews: Review[];
  isDarkMode: boolean;
  isLoading: boolean;
  
  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  toggleDarkMode: () => void;
  createOrder: (details: any, paymentMethod: string, bkashReference?: string) => Promise<void>;
  updateOrder: (orderId: string, data: any) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  
  // Admin Actions
  adminUpdateCredentials: (data: any) => Promise<void>;
  adminUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  adminAddProduct: (product: any) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;
  adminUpdateProduct: (product: any) => Promise<void>;
  adminAddSlider: (slider: any) => Promise<void>;
  adminUpdateSlider: (slider: any) => Promise<void>;
  adminDeleteSlider: (sliderId: string) => Promise<void>;
  adminAddCategory: (category: any) => Promise<void>;
  adminUpdateCategory: (category: any) => Promise<void>;
  adminDeleteCategory: (categoryId: string) => Promise<void>;
  adminAddCampaign: (campaign: any) => Promise<void>;
  adminUpdateCampaign: (campaign: any) => Promise<void>;
  adminDeleteCampaign: (campaignId: string) => Promise<void>;
  adminUpdateReview: (reviewId: string, data: any) => Promise<void>;
  adminDeleteReview: (reviewId: string) => Promise<void>;
  adminAddLandingPage: (page: any) => Promise<void>;
  adminUpdateLandingPage: (page: any) => Promise<void>;
  adminDeleteLandingPage: (pageId: string) => Promise<void>;
  refreshStats: () => Promise<any>;
  adminUsers: User[];
  adminGetUsers: () => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pRes, sRes, cRes, cpRes, rRes, lpRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/sliders'),
        fetch('/api/categories'),
        fetch('/api/campaigns'),
        fetch('/api/reviews'),
        fetch('/api/landing-pages')
      ]);

      const [p, s, cat, cp, r, lp] = await Promise.all([
        pRes.json(), sRes.json(), cRes.json(), cpRes.json(), rRes.json(), lpRes.json()
      ]);

      setProducts(p);
      setSliders(s);
      setCategories(cat);
      setCampaigns(cp);
      setReviews(r);
      setLandingPages(lp);

      if (user?.role === 'admin') {
        const [oRes, acRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/abandoned-carts')
        ]);
        setOrders(await oRes.json());
        setAbandonedCarts(await acRes.json());
      } else if (user?.role === 'customer') {
        const oRes = await fetch(`/api/orders?userId=${user.id}`);
        if (oRes.ok) setOrders(await oRes.json());
      }
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') fetchData();
  }, [user]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const clearCart = () => setCart([]);

  const login = async (identifier: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (res.ok) {
        const loggedUser = await res.json();
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
    } catch (e: any) {
      alert(e.message);
      throw e;
    }
  };

  const register = async (name: string, email?: string, phone?: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      if (res.ok) {
        const newUser = await res.json();
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Registration failed');
      }
    } catch (e: any) {
      alert(e.message);
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setOrders([]);
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Update user error", e);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  const createOrder = async (details: any, paymentMethod: string, bkashReference?: string) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = {
      items: cart,
      total,
      customerDetails: details,
      paymentMethod,
      bkashReference,
      userId: user?.id || 'guest',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    // In a real app, this would be a POST to /api/orders
    // For now we'll just mock it and save to db via admin endpoint if possible
    // But let's assume we have a public order endpoint
    const res = await fetch('/api/admin/orders', { // Mocking public access for now
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      clearCart();
      fetchData();
    }
  };

  const updateOrder = async (orderId: string, data: any) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) fetchData();
    else {
      const err = await res.json();
      alert(err.error || "Failed to update order");
    }
  };

  const deleteOrder = async (orderId: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'DELETE'
    });
    if (res.ok) fetchData();
    else {
      const err = await res.json();
      alert(err.error || "Failed to delete order");
    }
  };

  // Admin Actions
  const adminUpdateCredentials = async (data: any) => {
    const res = await fetch('/api/admin/credentials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      if (data.email && user) {
        const updatedUser = { ...user, email: data.email };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      alert("Admin credentials updated successfully");
    }
  };
  const adminUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const adminAddProduct = async (product: any) => {
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    fetchData();
  };

  const adminDeleteProduct = async (productId: string) => {
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    fetchData();
  };

  const adminUpdateProduct = async (product: any) => {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    fetchData();
  };

  const adminAddSlider = async (slider: any) => {
    await fetch('/api/admin/sliders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slider)
    });
    fetchData();
  };

  const adminUpdateSlider = async (slider: any) => {
    await fetch(`/api/admin/sliders/${slider.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slider)
    });
    fetchData();
  };

  const adminDeleteSlider = async (sliderId: string) => {
    await fetch(`/api/admin/sliders/${sliderId}`, { method: 'DELETE' });
    fetchData();
  };

  const adminAddCategory = async (category: any) => {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    fetchData();
  };

  const adminUpdateCategory = async (category: any) => {
    await fetch(`/api/admin/categories/${category.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    });
    fetchData();
  };

  const adminDeleteCategory = async (categoryId: string) => {
    await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
    fetchData();
  };

  const adminAddCampaign = async (campaign: any) => {
    await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });
    fetchData();
  };

  const adminUpdateCampaign = async (campaign: any) => {
    await fetch(`/api/admin/campaigns/${campaign.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });
    fetchData();
  };

  const adminDeleteCampaign = async (campaignId: string) => {
    await fetch(`/api/admin/campaigns/${campaignId}`, { method: 'DELETE' });
    fetchData();
  };

  const adminUpdateReview = async (reviewId: string, data: any) => {
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    fetchData();
  };

  const adminDeleteReview = async (reviewId: string) => {
    await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
    fetchData();
  };

  const adminAddLandingPage = async (page: any) => {
    await fetch('/api/admin/landing-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page)
    });
    fetchData();
  };

  const adminUpdateLandingPage = async (page: any) => {
    await fetch(`/api/admin/landing-pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page)
    });
    fetchData();
  };

  const adminDeleteLandingPage = async (pageId: string) => {
    await fetch(`/api/admin/landing-pages/${pageId}`, { method: 'DELETE' });
    fetchData();
  };

  const refreshStats = async () => {
    const res = await fetch('/api/admin/stats');
    return await res.json();
  };

  const adminGetUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      setAdminUsers(await res.json());
    }
  };

  const adminDeleteUser = async (userId: string) => {
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    adminGetUsers();
  };

  return (
    <AppContext.Provider value={{
      cart, wishlist, user, products, orders, sliders, categories, abandonedCarts, landingPages, campaigns, reviews, isDarkMode, isLoading,
      addToCart, removeFromCart, updateCartQuantity, toggleWishlist, clearCart,
      login, register, logout, updateUser, toggleDarkMode, createOrder, updateOrder, deleteOrder,
      adminUpdateCredentials, adminUpdateOrderStatus, adminAddProduct, adminDeleteProduct, adminUpdateProduct,
      adminAddSlider, adminUpdateSlider, adminDeleteSlider, 
      adminAddCategory, adminUpdateCategory, adminDeleteCategory, 
      adminAddCampaign, adminUpdateCampaign, adminDeleteCampaign, 
      adminUpdateReview, adminDeleteReview, 
      adminAddLandingPage, adminUpdateLandingPage, adminDeleteLandingPage, 
      refreshStats, adminUsers, adminGetUsers, adminDeleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
