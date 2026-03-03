
import React, { useState } from 'react';
import { Instagram, Twitter, Facebook, Youtube, MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      navigate('/hub-control-center');
      setClickCount(0);
    } else {
      setClickCount(newCount);
    }
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 pt-24 pb-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <a href="#/" className="text-3xl font-bold tracking-tighter text-primary-600 uppercase">Neeedy</a>
            <p className="text-slate-500 leading-relaxed">
              Neeedy - The ultimate destination for tech enthusiasts. Bringing you the finest electronics and smart gear.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white dark:bg-slate-800 rounded-xl hover:text-primary-600 hover:-translate-y-1 transition-all">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Service</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Warranty Support</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Delivery Options</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li className="pt-4">
                <a href="#/hub-control-center" className="inline-flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white rounded-xl transition-all shadow-sm">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Tech Updates</h4>
            <p className="text-slate-500 mb-6">Subscribe for exclusive launch events and special gadget deals.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Tech email..." 
                className="w-full px-4 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500" 
              />
              <button className="absolute right-2 top-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all">
                Sub
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 font-medium">
          <p onClick={handleSecretClick} className="cursor-default select-none">© 2026 Neeedy. Built for the future.</p>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {isChatOpen ? (
          <div className="bg-white dark:bg-slate-900 w-80 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-primary-600 p-6 text-white flex justify-between items-center">
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">Hub Support</h4>
                <p className="text-[10px] opacity-80">We're online and ready to help!</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 h-64 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm">
                Hello! Welcome to Neeedy. How can we assist you today?
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="h-16 w-16 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary-500/40 hover:scale-110 active:scale-95 transition-all group"
          >
            <MessageCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
