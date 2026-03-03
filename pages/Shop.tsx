
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../store';
import ProductCard from '../components/ui/ProductCard';
import { getShoppingAdvice } from '../services/gemini';
import { Filter, Search, Sparkles, MessageSquare, Send, X, Loader2, ArrowUpDown } from 'lucide-react';
import { ProductCategory } from '../types';

const Shop: React.FC = () => {
  const { products, categories: storeCategories } = useApp();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync search and category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const cat = params.get('category');
    
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  const categories = ['All', ...storeCategories.filter(c => c.status === 'active').map(c => c.name)];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    
    setIsAiLoading(true);
    const response = await getShoppingAdvice(aiMessage, products);
    setAiResponse(response || "I couldn't find a recommendation for that right now.");
    setIsAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-xl">
          <h1 className="text-5xl font-black tracking-tighter mb-2">Gadget Lab</h1>
          <p className="text-slate-500 font-medium">Explore high-performance tech curated for the ultimate experience.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tech..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-primary-500 focus:ring-0 w-64 md:w-80 text-sm font-bold transition-all outline-none"
            />
          </div>
          
          <div className="relative">
             <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
             <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:border-primary-500 appearance-none transition-all"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsAiOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-black hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Help</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center">
              <Filter className="h-3 w-3 mr-2" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' 
                      : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/20 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2 leading-tight">Elite Hub <br /> Member</h4>
              <p className="text-xs text-slate-400 mb-6 font-medium">Free shipping & priority access.</p>
              <a href="#/auth" className="block text-center py-3 bg-white text-slate-900 font-black rounded-xl text-sm hover:bg-slate-100 transition-all">Join Hub</a>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-300 dark:text-slate-700">
              <div className="h-24 w-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8">
                <Search className="h-10 w-10 opacity-20" />
              </div>
              <p className="text-xl font-bold">No gadgets found.</p>
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="text-primary-600 mt-2 font-black text-sm hover:underline underline-offset-4">Clear filters</button>
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant Modal */}
      {isAiOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/40">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Pure Assistant</h3>
                  <p className="text-[8px] text-primary-600 uppercase tracking-widest font-black">AI Concierge</p>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 h-[400px] overflow-y-auto space-y-4 no-scrollbar bg-white dark:bg-slate-900">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary-600" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm font-medium leading-relaxed">
                  Welcome to Neeedy! Looking for high-end audio or ultra-fast charging? Ask me anything.
                </div>
              </div>

              {aiResponse && (
                <div className="flex flex-col space-y-4">
                   <div className="flex items-start justify-end space-x-3">
                    <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-none text-sm font-bold shadow-lg shadow-primary-500/20 max-w-[80%]">
                      {aiMessage}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm font-medium leading-relaxed whitespace-pre-wrap">
                      {aiResponse}
                    </div>
                  </div>
                </div>
              )}

              {isAiLoading && (
                <div className="flex items-center space-x-2 text-primary-600 font-bold px-11">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest">Processing tech data...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleAiSearch} className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="relative">
                <input 
                  type="text" 
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask about tech specs..."
                  className="w-full pl-6 pr-14 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-primary-500 outline-none text-sm font-bold"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading || !aiMessage.trim()}
                  className="absolute right-2 top-2 p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all active:scale-90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
