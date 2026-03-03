
import React, { useState } from 'react';
import { useApp } from '../store';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, CreditCard, Banknote } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, createOrder, user, campaigns } = useApp();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'bkash'>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCampaign, setAppliedCampaign] = useState<any>(null);
  const [shippingDetails, setShippingDetails] = useState({
    email: user?.email || '',
    phone: '',
    address: '',
    fullName: user?.name || ''
  });
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashReference, setBkashReference] = useState('');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCampaign ? (appliedCampaign.discountType === 'percentage' ? (subtotal * appliedCampaign.discountValue / 100) : appliedCampaign.discountValue) : 0;
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    const campaign = campaigns.find(c => c.couponCode.toLowerCase() === couponCode.toLowerCase() && c.status === 'active');
    if (campaign) {
      setAppliedCampaign(campaign);
      alert(`Coupon applied! You saved ৳${(campaign.discountType === 'percentage' ? (subtotal * campaign.discountValue / 100) : campaign.discountValue).toLocaleString()}`);
    } else {
      alert('Invalid or expired coupon code');
      setAppliedCampaign(null);
    }
  };

  const handleCheckout = () => {
    setCheckoutStep('checkout');
  };

  const completeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingDetails.email || !shippingDetails.phone || !shippingDetails.address) {
      alert('Please fill in all shipping details');
      return;
    }
    if (paymentMethod === 'card' && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvc)) {
      alert('Please fill in card details');
      return;
    }
    if (paymentMethod === 'bkash' && (!bkashNumber || !bkashReference)) {
      alert('Please fill in bKash number and reference code');
      return;
    }

    createOrder({
      email: shippingDetails.email,
      phone: shippingDetails.phone,
      address: shippingDetails.address
    }, paymentMethod, bkashReference);
    setCheckoutStep('success');
  };

  if (cart.length === 0 && checkoutStep !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your hub is empty</h1>
        <p className="text-slate-500 max-w-md mb-8">Looks like you haven't added any gadgets yet. Explore our latest collection to find something special.</p>
        <a href="#/shop" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all">Start Shopping</a>
      </div>
    );
  }

  if (checkoutStep === 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8">
          <ShieldCheck className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-slate-500 max-w-md mb-8">We have received your order. We'll send a confirmation to your email shortly. Welcome to the future of gadgets.</p>
        <div className="flex space-x-4">
          <a href="#/shop" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all">Continue Shopping</a>
          <a href="#/orders" className="px-8 py-4 bg-slate-100 dark:bg-slate-800 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">View Orders</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-2 mb-12 text-sm font-medium text-slate-400">
        <span className={checkoutStep === 'cart' ? 'text-primary-600' : ''}>Gadget Hub</span>
        <ArrowRight className="h-4 w-4" />
        <span className={checkoutStep === 'checkout' ? 'text-primary-600' : ''}>Checkout</span>
        <ArrowRight className="h-4 w-4" />
        <span>Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {checkoutStep === 'cart' ? (
            <>
              <h1 className="text-3xl font-bold">Gadget Hub Cart</h1>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map(item => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="font-bold text-lg">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-slate-500">{item.category}</p>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl px-2">
                          <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-primary-600"><Minus className="h-4 w-4" /></button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-primary-600"><Plus className="h-4 w-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 p-2"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-left duration-500">
              <h1 className="text-3xl font-bold">Shipping & Payment</h1>
              <form id="checkout-form" onSubmit={completeOrder} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={shippingDetails.fullName}
                      onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={shippingDetails.email}
                      onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})}
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+880 1XXX-XXXXXX" 
                      value={shippingDetails.phone}
                      onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Delivery Address</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Flat No, Road No, Area, Dhaka" 
                      value={shippingDetails.address}
                      onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                    />
                  </div>
                </div>
                
                <div className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 rounded-3xl border-2 flex items-center space-x-4 transition-all ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-800'}`}
                    >
                      <CreditCard className={`h-6 w-6 ${paymentMethod === 'card' ? 'text-primary-600' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <p className="font-bold">Credit / Debit Card</p>
                        <p className="text-xs text-slate-500">Secure card payment</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-6 rounded-3xl border-2 flex items-center space-x-4 transition-all ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-800'}`}
                    >
                      <Banknote className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-primary-600' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <p className="font-bold">Cash on Delivery</p>
                        <p className="text-xs text-slate-500">Pay when you receive</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-6 rounded-3xl border-2 flex items-center space-x-4 transition-all ${paymentMethod === 'bkash' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-800'}`}
                    >
                      <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-[#D12053] text-[10px]">bKash</div>
                      <div className="text-left">
                        <p className="font-bold">bKash</p>
                        <p className="text-xs text-slate-500">Fast mobile payment</p>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="XXXX XXXX XXXX XXXX" 
                          value={cardInfo.number}
                          onChange={e => setCardInfo({...cardInfo, number: e.target.value})}
                          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            value={cardInfo.expiry}
                            onChange={e => setCardInfo({...cardInfo, expiry: e.target.value})}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">CVC</label>
                          <input 
                            type="text" 
                            placeholder="XXX" 
                            value={cardInfo.cvc}
                            onChange={e => setCardInfo({...cardInfo, cvc: e.target.value})}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bkash' && (
                    <div className="mt-6 p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">bKash Number</label>
                        <input 
                          type="tel" 
                          placeholder="01XXXXXXXXX" 
                          value={bkashNumber}
                          onChange={e => setBkashNumber(e.target.value)}
                          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference Code / TrxID</label>
                        <input 
                          type="text" 
                          placeholder="Enter your payment reference" 
                          value={bkashReference}
                          onChange={e => setBkashReference(e.target.value)}
                          className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                        />
                      </div>
                      <p className="text-xs text-slate-400 font-medium italic">Please send money to 01XXXXXXXXX and enter the reference code here.</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 space-y-6 border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold">Hub Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              {appliedCampaign && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedCampaign.couponCode})</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `৳${shipping.toLocaleString()}`}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>

            {checkoutStep === 'cart' && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Have a coupon?</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-4 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex items-center text-sm text-slate-500">
                <Truck className="h-4 w-4 mr-2 text-primary-600" />
                <span>Express Tech Delivery</span>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <ShieldCheck className="h-4 w-4 mr-2 text-primary-600" />
                <span>Authentic Hub Warranty</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center justify-center"
              >
                Checkout Now <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <div className="space-y-4">
                <button 
                  type="submit"
                  form="checkout-form"
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                >
                  Pay ৳{total.toLocaleString()}
                </button>
                <button 
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full py-4 text-slate-500 font-bold hover:underline"
                >
                  Back to Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
