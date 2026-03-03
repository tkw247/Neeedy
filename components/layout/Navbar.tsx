
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store';
import { ProductCategory } from '../../types';
import { 
  ShoppingBag, Search, User, Menu, X, Sun, Moon, 
  LogOut, LayoutDashboard, Heart, ChevronDown, Package,
  Cpu, Watch, Sparkles, Shirt, Gamepad2, Headphones, Home as HomeIcon, Activity,
  ShieldCheck
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  [ProductCategory.GADGET]: <Cpu className="h-4 w-4" />,
  [ProductCategory.SMART_HOME]: <HomeIcon className="h-4 w-4" />,
  [ProductCategory.FASHION]: <Shirt className="h-4 w-4" />,
};

const Navbar: React.FC = () => {
  const { cart, user, isDarkMode, toggleDarkMode, logout, wishlist } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHubMenuOpen, setIsHubMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (cartCount > 0) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/shop?q=${encodeURIComponent(navSearch)}`);
      setIsMenuOpen(false);
      setNavSearch('');
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Replaced with HOME text as requested */}
          <div className="flex items-center flex-shrink-0 mr-6 md:mr-12">
            <a href="#/" className="text-xl md:text-2xl font-black tracking-tighter text-primary-600 flex items-center gap-2 md:gap-3 group whitespace-nowrap">
              <div className="h-8 w-8 md:h-9 md:w-9 bg-primary-600 text-white rounded-xl md:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary-500/40 font-black">
                <HomeIcon className="h-5 w-5" />
              </div>
              <span className="font-black tracking-tighter text-lg">Neeedy</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => handleCategoryClick('Fashion')}
              className="text-[10px] font-black uppercase tracking-widest hover:text-primary-600 transition-colors"
            >
              Fashion
            </button>
            <button 
              onClick={() => handleCategoryClick('Gadget')}
              className="text-[10px] font-black uppercase tracking-widest hover:text-primary-600 transition-colors"
            >
              Gadget
            </button>
            
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder="Search hub..." 
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-black rounded-2xl w-48 focus:w-64 transition-all text-sm font-bold outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
            </form>

            <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-2"></div>

            <div className="relative">
              <button 
                onClick={() => setIsHubMenuOpen(!isHubMenuOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all group"
              >
                <ShoppingBag className="h-4 w-4" />
                My Hub
                <ChevronDown className={`h-3 w-3 transition-transform ${isHubMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isHubMenuOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl py-4 z-50 animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-2 mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Hub</p>
                  </div>
                  <a href="#/cart" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" onClick={() => setIsHubMenuOpen(false)}>
                    <div className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-3 text-primary-600" />
                      <span className="text-sm font-bold">Shopping Cart</span>
                    </div>
                    {cartCount > 0 && <span className="bg-primary-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{cartCount}</span>}
                  </a>
                  <a href="#/shop" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" onClick={() => setIsHubMenuOpen(false)}>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-3 text-red-500" />
                      <span className="text-sm font-bold">My Wishlist</span>
                    </div>
                    {wishlist.length > 0 && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                  </a>
                  <a href="#/orders" className="flex items-center px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group" onClick={() => setIsHubMenuOpen(false)}>
                    <Package className="h-4 w-4 mr-3 text-slate-400" />
                    <span className="text-sm font-bold">My Orders</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user?.role === 'admin' && (
              <a href="#/hub-control-center" className="p-3 rounded-2xl bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all active:scale-90 group" title="Admin Hub">
                <ShieldCheck className="h-6 w-6" />
              </a>
            )}
            <button 
              onClick={toggleDarkMode} 
              className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 relative overflow-hidden group"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-primary-600" />}
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-1.5 pl-4 pr-2 bg-slate-100 dark:bg-slate-900 rounded-2xl hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-500"
                >
                  <span className="text-sm font-black hidden sm:block uppercase tracking-widest">{user.name}</span>
                  <div className="h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] py-4 z-50 animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Hub</p>
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <a href="#/profile" className="flex items-center px-6 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <User className="h-4 w-4 mr-3 text-primary-600" /> Profile Details
                    </a>
                    <a href="#/orders" className="flex items-center px-6 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                       <ShoppingBag className="h-5 w-5 mr-3 text-slate-400" /> My Gadget Orders
                    </a>
                    <hr className="my-2 border-slate-100 dark:border-slate-800" />
                    <button 
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="flex items-center w-full px-6 py-3 text-sm font-black text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="#/auth" className="flex px-4 md:px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all whitespace-nowrap">Sign In</a>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-8 space-y-8 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Search hub..." 
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </form>
          <a href="#/" className="block text-2xl font-black tracking-tighter" onClick={() => setIsMenuOpen(false)}>Neeedy</a>
          
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Explore</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleCategoryClick('Fashion')}
                className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold"
              >
                <Shirt className="h-5 w-5 mr-3 text-primary-600" /> Fashion
              </button>
              <button 
                onClick={() => handleCategoryClick('Gadget')}
                className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold"
              >
                <Cpu className="h-5 w-5 mr-3 text-primary-600" /> Gadget
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">My Hub</p>
            <div className="grid grid-cols-1 gap-2">
              <a href="#/cart" className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold" onClick={() => setIsMenuOpen(false)}>
                <ShoppingBag className="h-5 w-5 mr-3 text-primary-600" /> Shopping Cart ({cartCount})
              </a>
              <a href="#/shop" className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold" onClick={() => setIsMenuOpen(false)}>
                <Heart className="h-5 w-5 mr-3 text-red-500" /> My Wishlist ({wishlist.length})
              </a>
              <a href="#/orders" className="flex items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-sm font-bold" onClick={() => setIsMenuOpen(false)}>
                <Package className="h-5 w-5 mr-3 text-slate-400" /> My Orders
              </a>
            </div>
          </div>

          <a href="#/shop" className="block text-2xl font-black tracking-tighter" onClick={() => setIsMenuOpen(false)}>SHOP</a>
          {!user && (
            <a href="#/auth" className="block text-2xl font-black tracking-tighter text-primary-600" onClick={() => setIsMenuOpen(false)}>SIGN IN</a>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
