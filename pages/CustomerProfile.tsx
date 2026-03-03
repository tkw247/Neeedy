import React, { useState } from 'react';
import { useApp } from '../store';
import { User, Package, Heart, Settings, LogOut, ChevronRight, Clock, MapPin, Save } from 'lucide-react';
import { motion } from 'motion/react';

const CustomerProfile: React.FC = () => {
  const { user, orders, logout, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6 font-medium">Please login to view your profile.</p>
          <a href="#/auth" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Login Now</a>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === user.id || o.customerEmail === user.email);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="h-24 w-24 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-1">{user.name}</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">{user.email}</p>
            <button onClick={logout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>

          <nav className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <span className="flex items-center gap-3"><Package className="h-4 w-4" /> My Orders</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <span className="flex items-center gap-3"><Settings className="h-4 w-4" /> Profile Settings</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'orders' ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Order History</h2>
                <p className="text-slate-500 font-medium">Track and manage your recent purchases.</p>
              </div>

              <div className="space-y-4">
                {userOrders.length > 0 ? userOrders.map((order) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id} 
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order #{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <h4 className="font-black uppercase tracking-tight text-lg">৳{order.total.toLocaleString()}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold text-slate-400">{order.items.length} items</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Details</button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-bold">You haven't placed any orders yet.</p>
                    <a href="#/shop" className="mt-4 inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Start Shopping</a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Profile Settings</h2>
                <p className="text-slate-500 font-medium">Update your personal information and preferences.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.name}
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileForm.phone}
                      onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Default Shipping Address</label>
                  <textarea 
                    rows={3}
                    value={profileForm.address}
                    onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all">
                    <Save className="h-4 w-4" /> Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
