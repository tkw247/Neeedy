
import React from 'react';
import { CreditCard, Wallet, Smartphone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tighter text-primary-600">NEEEDY</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your ultimate hub for premium tech gadgets and lifestyle accessories. We bring the future to your doorstep.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#/" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Home</a></li>
              <li><a href="#/fashion" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Fashion</a></li>
              <li><a href="#/gadget" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Gadgets</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Returns & Refunds</a></li>
              <li><a href="#/hub-control-center" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Payment Methods</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors overflow-hidden p-1">
                  <img src="https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg" alt="bKash" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">bKash</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mobile Wallet</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors overflow-hidden p-1">
                  <img src="https://freelogopng.com/images/all-img/1679248833nagad-logo-png.png" alt="Nagad" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Nagad</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mobile Wallet</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors overflow-hidden p-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa Card" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Visa Card</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Credit/Debit Card</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © 2024 NEEEDY HUB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
