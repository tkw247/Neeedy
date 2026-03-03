
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Product } from '../types';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RefreshCw, ChevronLeft, Share2, Check } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold">Gadget not found</h2>
        <button onClick={() => navigate('/shop')} className="mt-8 px-8 py-3 bg-primary-600 text-white rounded-xl">Back to Shop</button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors font-bold">
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                 <img src={product.image} className="w-full h-full object-cover" alt="" />
               </div>
             ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-600 font-black uppercase tracking-[0.2em] text-xs mb-4">{product.category}</p>
                <h1 className="text-5xl font-black tracking-tighter mb-4">{product.name}</h1>
              </div>
              <button onClick={() => toggleWishlist(product.id)} className={`p-4 rounded-2xl border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}>
                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-black">
                <Star className="h-4 w-4 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-400 font-medium">{product.reviews} customer reviews</span>
            </div>

            <div className="flex items-center space-x-4 mb-2">
              {product.regularPrice > product.price && (
                <span className="text-xl text-slate-400 line-through font-bold">৳{product.regularPrice.toLocaleString()}</span>
              )}
              <p className="text-4xl font-black text-slate-900 dark:text-white">৳{product.price.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-5 rounded-[1.5rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-3 ${
                  added 
                    ? 'bg-green-500 text-white' 
                    : product.stock > 0 
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {added ? <Check className="h-6 w-6" /> : <ShoppingCart className="h-6 w-6" />}
                <span>{added ? 'Added to Hub' : product.stock > 0 ? 'Add to Hub Cart' : 'Out of Stock'}</span>
              </button>
              <button className="p-5 border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm font-bold text-center text-slate-400">
              {product.stock > 0 ? `Only ${product.stock} items left in stock!` : 'Restocking soon.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 text-sm font-bold">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-primary-600"><Truck className="h-5 w-5" /></div>
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-bold">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-primary-600"><ShieldCheck className="h-5 w-5" /></div>
              <span>Pure Warranty</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-bold">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-primary-600"><RefreshCw className="h-5 w-5" /></div>
              <span>15-Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
