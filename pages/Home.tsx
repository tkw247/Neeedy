
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { ProductCategory } from '../types';
import ProductCard from '../components/ui/ProductCard';
import { ArrowRight, Cpu, Watch, Home as HomeIcon, ChevronRight, List } from 'lucide-react';

const Home: React.FC = () => {
  const { products, sliders, categories, campaigns } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSlider = sliders.find(s => s.status === 'active');
  const activeSlides = mainSlider?.slides || [];
  const settings = mainSlider?.settings || { transitionType: 'fade', speed: 5000 };

  useEffect(() => {
    if (activeSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, settings.speed);
      return () => clearInterval(timer);
    }
  }, [activeSlides.length, settings.speed]);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section with Category Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
              <div className="p-2 bg-primary-600 text-white rounded-lg">
                <List className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Categories</h3>
            </div>
            <div className="py-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {categories.filter(c => c.status === 'active').length > 0 ? (
                categories.filter(c => c.status === 'active').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
                    className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 transition-all group"
                  >
                    <span className="flex items-center">
                      {cat.image ? (
                        <img src={cat.image} className="w-5 h-5 mr-3 object-contain" alt="" />
                      ) : (
                        <div className="w-5 h-5 mr-3 bg-slate-100 dark:bg-slate-800 rounded-md" />
                      )}
                      {cat.name}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-xs font-bold text-slate-400 italic">No categories added yet.</p>
                </div>
              )}
            </div>
          </aside>

          {/* Slider Section */}
          <section className="flex-1 relative h-[45vh] min-h-[450px] overflow-hidden bg-slate-100 dark:bg-slate-900 rounded-[2rem] shadow-xl">
            {activeSlides.length > 0 ? activeSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0' 
                    : settings.transitionType === 'fade' 
                      ? 'opacity-0' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
                  <div className="px-8 md:px-16 w-full">
                    <div className="max-w-xl">
                      <div className="inline-block px-3 py-1 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 animate-bounce">
                        New Tech 2026
                      </div>
                      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase leading-none">
                        {slide.title}
                      </h1>
                      <p className="text-slate-300 font-medium text-base mb-6 max-w-md line-clamp-2">
                        {slide.subtitle}
                      </p>
                      <div className="flex space-x-4">
                        <a href={slide.link} className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-xs shadow-2xl shadow-primary-500/40 transition-all hover:scale-105 active:scale-95">
                          {slide.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 font-bold">No active sliders.</p>
              </div>
            )}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentSlide ? 'w-8 bg-primary-500' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Campaign Banners */}
      {campaigns.filter(c => c.status === 'active' && c.image).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {campaigns.filter(c => c.status === 'active' && c.image).map(cp => (
              <div key={cp.id} className="relative h-24 md:h-32 rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer">
                <img src={cp.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={cp.name} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8 md:px-12">
                  <div>
                    <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">{cp.name}</h3>
                    <p className="text-primary-400 font-black text-xs uppercase tracking-widest">Use Code: {cp.couponCode}</p>
                  </div>
                </div>
                <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2">
                  <div className="bg-white text-slate-900 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                    Claim Offer
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-1 uppercase">Featured Products</h2>
            <p className="text-slate-500 font-medium text-sm">Our top-tier gadget selections.</p>
          </div>
          <a href="#/shop" className="text-primary-600 font-black text-xs hover:underline flex items-center group">
            Explore All <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.filter(p => p.isFeatured).slice(0, 5).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-1 uppercase">All Products</h2>
            <p className="text-slate-500 font-medium text-sm">Browse our entire collection.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.slice(0, 15).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* More Button */}
        <div className="mt-12 text-center">
          <a 
            href="#/shop" 
            className="inline-flex items-center px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            MORE <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
