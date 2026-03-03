
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useApp } from '../../store';
import { ShoppingCart, Star, Heart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, categories } = useApp();
  const [added, setAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isWishlisted = wishlist.includes(product.id);

  const categoryName = categories.find(c => c.id === product.category)?.name || 'Gadget';

  useEffect(() => {
    if (product.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [product.images.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
      <a href={`#/product/${product.id}`} className="block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
        {product.images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
          />
        ))}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[8px] font-black px-2 py-1 rounded-full backdrop-blur-sm z-10">
            SOLD OUT
          </div>
        )}
      </a>
      
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
          isWishlisted 
        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
        : 'bg-white/80 dark:bg-slate-800/80 text-slate-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[8px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest">{categoryName}</p>
          <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-full">
            <Star className="h-2.5 w-2.5 text-yellow-500 fill-current" />
            <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
          <a href={`#/product/${product.id}`}>{product.name}</a>
        </h3>
        
        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Price</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">৳{product.price.toLocaleString()}</span>
              {product.regularPrice > product.price && (
                <span className="text-[10px] text-slate-400 line-through font-bold">৳{product.regularPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${
              added 
                ? 'bg-green-500 text-white' 
                : product.stock > 0 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
