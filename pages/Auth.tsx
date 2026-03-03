
import React, { useState } from 'react';
import { useApp } from '../store';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      window.location.hash = '#/';
    } catch (error) {
      // Error is handled in store with alert
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {isLogin ? 'Hello, Tech Fan' : 'Join Neeedy'}
            </h1>
            <p className="text-slate-500">
              {isLogin ? 'Sign in to access the premium collection' : 'Create an account for exclusive gadget drops'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="password" 
                placeholder="Password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center justify-center"
            >
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-slate-500 hover:text-primary-600"
            >
              {isLogin ? "New here? Sign up" : "Already a member? Sign in"}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure Hub Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
