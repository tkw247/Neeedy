import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Package, Users, DollarSign, TrendingUp, Plus, Trash2, Edit, CheckCircle, 
  Clock, Lock, X, LayoutDashboard, Image as ImageIcon, Layers, ShoppingCart, 
  Star, FileText, Megaphone, MessageSquare, Search, Filter, ChevronRight, 
  ArrowUpRight, ArrowDownRight, MoreVertical, Download, Mail, Eye, Save, 
  PlusCircle, Trash, Check, AlertCircle, Settings, Globe, ShieldCheck, User, LogOut,
  Copy, MapPin, Phone, Truck, RefreshCw
} from 'lucide-react';
import { ProductCategory, Product, Order, Slider, Category, Campaign, Review, LandingPage, AbandonedCart } from '../types';

const Dashboard: React.FC = () => {
  const { 
    user, products, orders, sliders, categories, abandonedCarts, landingPages, campaigns, reviews, adminUsers,
    adminUpdateOrderStatus, adminAddProduct, adminDeleteProduct, adminUpdateProduct,
    adminAddSlider, adminUpdateSlider, adminDeleteSlider, adminAddCategory, adminUpdateCategory, adminDeleteCategory, adminAddCampaign, adminUpdateCampaign, adminDeleteCampaign, adminUpdateReview, adminAddLandingPage, adminUpdateLandingPage, adminDeleteLandingPage,
    adminGetUsers, adminDeleteUser, adminUpdateCredentials,
    refreshStats, login, deleteOrder
  } = useApp();

  const [activeSection, setActiveSection] = useState('overview');
  const [adminPassword, setAdminPassword] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'product' | 'slider' | 'category' | 'campaign' | 'landing' | 'order'>('product');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Slider States (Moved to top level to fix Rules of Hooks)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', buttonText: 'Shop Now', link: '#/shop', image: '' });

  // Product Form States (Moved to top level to fix Rules of Hooks)
  const [pForm, setPForm] = useState({
    name: '', description: '', price: '', regularPrice: '', sku: '', stock: '', category: '', images: [] as string[], isFeatured: false
  });

  // Landing Page Form States
  const [lpForm, setLpForm] = useState({
    title: '', slug: '', status: 'draft' as 'published' | 'draft', seoTitle: '', seoDescription: ''
  });

  // Campaign Form States
  const [cpForm, setCpForm] = useState({
    name: '', discountType: 'percentage' as 'percentage' | 'fixed', discountValue: '', startDate: '', endDate: '', couponCode: '', status: 'active' as 'active' | 'inactive', image: ''
  });

  // Category Form States
  const [catForm, setCatForm] = useState({
    name: '', status: 'active' as 'active' | 'inactive', image: ''
  });

  // Settings States
  const [adminEmail, setAdminEmail] = useState(user?.email || '');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      refreshStats().then(setStats);
      adminGetUsers();
    }
  }, [user, orders, products]);

  useEffect(() => {
    if (!editingSlider && sliders.length > 0) {
      setEditingSlider(sliders[0]);
    }
  }, [sliders]);

  useEffect(() => {
    if (!pForm.category && categories.length > 0) {
      setPForm(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'purehub2026') {
      login('admin@purehub.com', 'purehub2026');
    } else {
      alert('Incorrect Hub Access Key');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-primary-600 text-white rounded-2xl shadow-xl shadow-primary-500/30">
              <Lock className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-center mb-2 tracking-tighter uppercase">Hub Control</h1>
          <p className="text-slate-500 text-center mb-8 font-medium">Enter the master key to access the administrative console.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Master Access Key" 
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 transition-all font-bold"
            />
            <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
              Authenticate
            </button>
          </form>
          <a href="#/" className="block text-center mt-8 text-xs font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">Return to Storefront</a>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sliders', label: 'Manage Slider', icon: ImageIcon },
    { id: 'categories', label: 'Manage Category', icon: Layers },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'abandoned', label: 'Abandoned Carts', icon: AlertCircle },
    { id: 'products', label: 'All Products', icon: Package },
    { id: 'new-product', label: 'New Product', icon: PlusCircle },
    { id: 'landing', label: 'Landing Pages', icon: Globe },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'reviews', label: 'Review Management', icon: MessageSquare },
    { id: 'users', label: 'User Database', icon: Users },
    { id: 'settings', label: 'Hub Settings', icon: Settings },
  ];

  // --- RENDER SECTIONS ---

  const handleModalSubmit = async () => {
    if (modalType === 'landing') {
      if (editingItem) {
        await adminUpdateLandingPage({ ...editingItem, ...lpForm, seo: { title: lpForm.seoTitle, description: lpForm.seoDescription } });
      } else {
        await adminAddLandingPage({ ...lpForm, seo: { title: lpForm.seoTitle, description: lpForm.seoDescription }, sections: [] });
      }
    } else if (modalType === 'campaign') {
      const campaignData = {
        ...cpForm,
        discountValue: parseFloat(cpForm.discountValue as string),
        performance: editingItem?.performance || { uses: 0, revenue: 0 }
      };
      if (editingItem) {
        await adminUpdateCampaign({ ...editingItem, ...campaignData });
      } else {
        await adminAddCampaign(campaignData);
      }
    } else if (modalType === 'category') {
      if (editingItem) {
        await adminUpdateCategory({ ...editingItem, ...catForm });
      } else {
        await adminAddCategory(catForm);
      }
    } else if (modalType === 'order' && editingItem) {
      // Order status is handled via adminUpdateOrderStatus, but we can close modal here
    }
    setIsModalOpen(false);
    setEditingItem(null);
    // Reset forms
    setLpForm({ title: '', slug: '', status: 'draft', seoTitle: '', seoDescription: '' });
    setCpForm({ name: '', discountType: 'percentage', discountValue: '', startDate: '', endDate: '', couponCode: '', status: 'active' });
    setCatForm({ name: '', status: 'active', image: '' });
  };

  const openLandingModal = (page?: LandingPage) => {
    if (page) {
      setEditingItem(page);
      setLpForm({
        title: page.title,
        slug: page.slug,
        status: page.status,
        seoTitle: page.seo.title,
        seoDescription: page.seo.description
      });
    } else {
      setEditingItem(null);
      setLpForm({ title: '', slug: '', status: 'draft', seoTitle: '', seoDescription: '' });
    }
    setModalType('landing');
    setIsModalOpen(true);
  };

  const openCampaignModal = (cp?: Campaign) => {
    if (cp) {
      setEditingItem(cp);
      setCpForm({
        name: cp.name,
        discountType: cp.discountType,
        discountValue: cp.discountValue.toString(),
        startDate: cp.startDate.split('T')[0],
        endDate: cp.endDate.split('T')[0],
        couponCode: cp.couponCode,
        status: cp.status,
        image: cp.image || ''
      });
    } else {
      setEditingItem(null);
      setCpForm({ name: '', discountType: 'percentage', discountValue: '', startDate: '', endDate: '', couponCode: '', status: 'active', image: '' });
    }
    setModalType('campaign');
    setIsModalOpen(true);
  };

  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingItem(cat);
      setCatForm({
        name: cat.name,
        status: cat.status,
        image: cat.image || ''
      });
    } else {
      setEditingItem(null);
      setCatForm({ name: '', status: 'active', image: '' });
    }
    setModalType('category');
    setIsModalOpen(true);
  };

  const renderOverview = () => {
    if (!stats) return <div className="p-8 text-center font-bold">Loading stats...</div>;

    const cards = [
      { label: 'Total Sales', value: `৳${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%' },
      { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50', trend: '+8.2%' },
      { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+5.4%' },
      { label: 'Total Products', value: stats.totalProducts, icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+2.1%' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${card.bg} dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">{card.trend}</span>
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-black tracking-tight">{card.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight">Sales Analytics</h3>
              <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 5000 },
                  { name: 'Thu', sales: 2780 }, { name: 'Fri', sales: 1890 }, { name: 'Sat', sales: 2390 }, { name: 'Sun', sales: 3490 }
                ]}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Top Selling</h3>
            <div className="space-y-6">
              {stats.topProducts.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <p className="font-bold text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.salesCount} Sales</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight">Recent Hub Orders</h3>
            <button onClick={() => setActiveSection('orders')} className="text-xs font-black text-primary-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-sm">{order.id}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-sm">{order.customerDetails.fullName || 'Guest'}</p>
                      <p className="text-xs text-slate-400">{order.customerDetails.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-sm">৳{order.total.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><MoreVertical className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSliders = () => {
    const handleSaveSettings = () => {
      if (editingSlider) {
        adminUpdateSlider(editingSlider);
      }
    };

    const handleAddSlide = () => {
      if (editingSlider && newSlide.image) {
        const updatedSlider = {
          ...editingSlider,
          slides: [...editingSlider.slides, { ...newSlide, id: Math.random().toString(36).substr(2, 9) }]
        };
        setEditingSlider(updatedSlider);
        adminUpdateSlider(updatedSlider);
        setNewSlide({ title: '', subtitle: '', buttonText: 'Shop Now', link: '#/shop', image: '' });
      }
    };

    const handleUpdateSlide = () => {
      if (editingSlider && editingSlide) {
        const updatedSlider = {
          ...editingSlider,
          slides: editingSlider.slides.map(s => s.id === editingSlide.id ? editingSlide : s)
        };
        setEditingSlider(updatedSlider);
        adminUpdateSlider(updatedSlider);
        setEditingSlide(null);
      }
    };

    const handleDeleteSlide = (slideId: string) => {
      if (editingSlider) {
        const updatedSlider = {
          ...editingSlider,
          slides: editingSlider.slides.filter(s => s.id !== slideId)
        };
        setEditingSlider(updatedSlider);
        adminUpdateSlider(updatedSlider);
      }
    };

    const handleImgUpload = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewSlide(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    };

    if (!editingSlider) return (
      <div className="p-20 text-center">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500 font-bold">No slider configuration found.</p>
        <button 
          onClick={() => adminAddSlider({ 
            slides: [], 
            settings: { transitionType: 'fade', speed: 5000 }, 
            status: 'active' 
          })}
          className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
        >
          Create Slider
        </button>
      </div>
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom duration-500">
        {/* Left: Slides List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight">Active Slides ({editingSlider.slides.length})</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {editingSlider.slides.map((slide, index) => (
              <div key={slide.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group flex flex-col md:flex-row">
                <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                  <img src={slide.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-black">#{index + 1}</div>
                </div>
                <div className="flex-grow p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-1">{slide.title || 'Untitled Slide'}</h4>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4">{slide.subtitle || 'No description provided.'}</p>
                    <div className="flex space-x-4">
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {slide.buttonText}
                      </div>
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 truncate max-w-[150px]">
                        {slide.link}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-2">
                    <button 
                      onClick={() => setEditingSlide(slide)}
                      className="p-3 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-lg shadow-primary-500/10"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-500/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {editingSlider.slides.length === 0 && (
              <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No slides added yet. Use the form on the right to add slides.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Slider Settings & Add Slide */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Slider Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transition Type</label>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button 
                    onClick={() => setEditingSlider({ ...editingSlider, settings: { ...editingSlider.settings, transitionType: 'slide' } })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${editingSlider.settings.transitionType === 'slide' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600' : 'text-slate-400'}`}
                  >
                    Slide
                  </button>
                  <button 
                    onClick={() => setEditingSlider({ ...editingSlider, settings: { ...editingSlider.settings, transitionType: 'fade' } })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${editingSlider.settings.transitionType === 'fade' ? 'bg-white dark:bg-slate-700 shadow-md text-primary-600' : 'text-slate-400'}`}
                  >
                    Fade
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slide Speed (ms)</label>
                <input 
                  type="number" 
                  step="500"
                  value={editingSlider.settings.speed}
                  onChange={e => setEditingSlider({ ...editingSlider, settings: { ...editingSlider.settings, speed: parseInt(e.target.value) } })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                <select 
                  value={editingSlider.status}
                  onChange={e => setEditingSlider({ ...editingSlider, status: e.target.value as any })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button 
                onClick={handleSaveSettings}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">
              {editingSlide ? 'Edit Slide' : 'Add New Slide'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slide Image</label>
                <label className="w-full aspect-video border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                  {(editingSlide ? editingSlide.image : newSlide.image) ? (
                    <img src={editingSlide ? editingSlide.image : newSlide.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <>
                      <Plus className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (editingSlide) setEditingSlide({...editingSlide, image: reader.result as string});
                        else setNewSlide({...newSlide, image: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" />
                </label>
              </div>
              <input 
                placeholder="Title" 
                value={editingSlide ? editingSlide.title : newSlide.title}
                onChange={e => editingSlide ? setEditingSlide({...editingSlide, title: e.target.value}) : setNewSlide({ ...newSlide, title: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold text-sm"
              />
              <input 
                placeholder="Subtitle" 
                value={editingSlide ? editingSlide.subtitle : newSlide.subtitle}
                onChange={e => editingSlide ? setEditingSlide({...editingSlide, subtitle: e.target.value}) : setNewSlide({ ...newSlide, subtitle: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Button Text" 
                  value={editingSlide ? editingSlide.buttonText : newSlide.buttonText}
                  onChange={e => editingSlide ? setEditingSlide({...editingSlide, buttonText: e.target.value}) : setNewSlide({ ...newSlide, buttonText: e.target.value })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold text-sm"
                />
                <input 
                  placeholder="Link" 
                  value={editingSlide ? editingSlide.link : newSlide.link}
                  onChange={e => editingSlide ? setEditingSlide({...editingSlide, link: e.target.value}) : setNewSlide({ ...newSlide, link: e.target.value })}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold text-sm"
                />
              </div>
              <div className="flex space-x-2">
                {editingSlide && (
                  <button 
                    onClick={() => setEditingSlide(null)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={editingSlide ? handleUpdateSlide : handleAddSlide}
                  disabled={editingSlide ? !editingSlide.image : !newSlide.image}
                  className="flex-[2] py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {editingSlide ? 'Update Slide' : 'Add Slide'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Product Categories</h2>
          <p className="text-slate-500 font-medium">Organize your gadgets for better discoverability.</p>
        </div>
        <button 
          onClick={() => openCategoryModal()}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:scale-105 transition-all"
        >
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center group hover:shadow-xl transition-all">
            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 overflow-hidden">
              <img src={cat.image || 'https://picsum.photos/seed/cat/200/200'} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
            </div>
            <h4 className="font-black text-sm uppercase tracking-tight mb-1">{cat.name}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{cat.status}</p>
            <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openCategoryModal(cat)} className="p-2 hover:text-primary-600"><Edit className="h-4 w-4" /></button>
              <button onClick={() => adminDeleteCategory(cat.id)} className="p-2 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => {
    const filteredOrders = (orders || []).filter(order => {
      if (!order || !order.customerDetails || !order.items) return false;
      
      const matchesSearch = 
        (order.customerDetails.fullName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.customerDetails.phone || '').includes(orderSearch) ||
        (order.customerDetails.address || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.id || '').toLowerCase().includes(orderSearch.toLowerCase());
      
      const matchesStatus = orderStatusFilter === 'All' || (order.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
      
      // Basic date filter logic (can be expanded)
      const matchesDate = orderDateFilter === 'All' || true; 

      return matchesSearch && matchesStatus && matchesDate;
    });

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-[2rem] p-10 text-white shadow-xl shadow-orange-500/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">অর্ডার ম্যানেজমেন্ট</h2>
          </div>
          <p className="text-orange-100 font-medium">কাস্টমার অর্ডার দেখুন এবং পরিচালনা করুন</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-end gap-6">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">স্ট্যাটাস</label>
            <select 
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 font-bold appearance-none"
            >
              <option value="All">সব</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">তারিখ</label>
            <select 
              value={orderDateFilter}
              onChange={(e) => setOrderDateFilter(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 font-bold appearance-none"
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
            </select>
          </div>
          <div className="space-y-2 flex-[2] min-w-[300px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">সার্চ করুন</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="নাম / ফোন / ঠিকানা" 
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500 font-bold"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
              পেজ 1 / 1 ({filteredOrders.length} আইটেম)
            </div>
            <button 
              onClick={() => { setOrderSearch(''); setOrderStatusFilter('All'); setOrderDateFilter('All'); }}
              className="px-6 py-4 bg-slate-200 dark:bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all"
            >
              রিসেট
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => (
            <div key={order.id} className="bg-[#FFFBEB] dark:bg-slate-900/50 rounded-[2.5rem] p-10 border border-orange-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Customer Info */}
                <div className="lg:col-span-1 flex flex-col items-center">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center w-full">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">সিরিয়াল</p>
                    <p className="text-2xl font-black text-orange-600">#{index + 1}</p>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  {/* Customer Name */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">কাস্টমার নাম</p>
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerDetails.fullName}</p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ফোন নম্বর</p>
                        <p className="font-bold text-slate-900 dark:text-white">{order.customerDetails.phone}</p>
                      </div>
                    </div>
                    <button onClick={() => copyToClipboard(order.customerDetails.phone)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                      <Copy className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Address */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-emerald-600" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ঠিকানা</p>
                      </div>
                      <button onClick={() => copyToClipboard(order.customerDetails.address)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                        <Copy className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                    <div className="space-y-2 pl-14">
                      <div className="flex gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-500">জেলা</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">ঢাকা</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-500">থানা</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">মিরপুর</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-500">ঠিকানা</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{order.customerDetails.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ডেলিভারি তথ্য</p>
                    <p className="font-bold text-slate-900 dark:text-white">insideDhaka <span className="text-orange-600">৳70</span></p>
                  </div>
                </div>

                {/* Middle Column: Product Info */}
                <div className="lg:col-span-4 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">প্রোডাক্ট লিস্ট</p>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex gap-4">
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600">
                          <img src={item.images?.[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-black text-sm text-slate-900 dark:text-white truncate">{item.name}</h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-slate-500">৳{item.price}</span>
                            <span className="text-xs font-bold text-slate-500">• পরিমাণ: {item.quantity}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">color: White</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">stock: 50</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Price */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-orange-400 dark:border-orange-900 flex justify-between items-center">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">মোট মূল্য</p>
                    <p className="text-3xl font-black text-orange-600">৳{(order.total || 0).toLocaleString()}.00</p>
                  </div>

                  {/* Order Time */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">অর্ডার টাইম:</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{order.createdAt ? formatRelativeTime(order.createdAt) : ''}</p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">স্ট্যাটাস</p>
                    <select 
                      value={order.status || 'pending'}
                      onChange={(e) => adminUpdateOrderStatus(order.id, e.target.value as any)}
                      className="w-full p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl outline-none border-2 border-orange-200 dark:border-orange-800 font-black text-xs uppercase tracking-widest text-orange-700 dark:text-orange-400 appearance-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-3 flex flex-col gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">অ্যাকশন</p>
                  <button onClick={() => { setModalType('order'); setEditingItem(order); setIsModalOpen(true); }} className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
                    <Eye className="h-4 w-4" /> বিস্তারিত দেখুন
                  </button>
                  <button className="w-full py-4 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-200 transition-all">
                    <Truck className="h-4 w-4" /> কুরিয়ার প্রেস করুন
                  </button>
                  <button className="w-full py-4 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-200 transition-all">
                    <RefreshCw className="h-4 w-4" /> স্ট্যাটাস চেক করুন
                  </button>
                  <button onClick={() => { if(window.confirm('অর্ডারটি ডিলিট করতে চান?')) deleteOrder(order.id); }} className="w-full py-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-200 transition-all">
                    <Trash2 className="h-4 w-4" /> ডিলিট করুন
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 font-bold">কোন অর্ডার পাওয়া যায়নি।</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
            পেজ 1 / 1 — মোট {filteredOrders.length} অর্ডার
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">পূর্ববর্তী</button>
            <div className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-orange-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-600">1</div>
            <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">পরবর্তী</button>
          </div>
        </div>
      </div>
    );
  };

  const renderAbandonedCarts = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">Abandoned Carts</h2>
        <p className="text-slate-500 font-medium">Recover potential sales by reaching out to customers.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Items</th>
                <th className="px-8 py-4">Value</th>
                <th className="px-8 py-4">Last Activity</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {abandonedCarts.map(cart => (
                <tr key={cart.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-sm">{cart.customerName}</p>
                    <p className="text-xs text-slate-400">{cart.customerEmail}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-2 overflow-hidden">
                      {cart.items.map((item, i) => (
                        <img key={i} src={item.images[0]} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" alt="" />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-sm">৳{cart.total.toLocaleString()}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(cart.lastUpdated).toLocaleString()}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center ml-auto">
                      <Mail className="h-3 w-3 mr-2" /> Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
              {abandonedCarts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No abandoned carts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAllProducts = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Gadget Inventory</h2>
          <p className="text-slate-500 font-medium">Manage your entire product catalog.</p>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search gadgets..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none focus:border-primary-500" />
          </div>
          <button onClick={() => setActiveSection('new-product')} className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:scale-105 transition-all">
            Add New
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">SKU</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Sales</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{categories.find(c => c.id === p.category)?.name || 'Gadget'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="px-8 py-5 font-black text-sm">৳{p.price.toLocaleString()}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-xs font-bold">{p.stock} units</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-sm">{p.salesCount}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 hover:text-primary-600"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => adminDeleteProduct(p.id)} className="p-2 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNewProduct = () => {
    const handleImgUpload = (e: any) => {
      const files = Array.from(e.target.files);
      files.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    };

    const handleSubmit = (e: any) => {
      e.preventDefault();
      adminAddProduct({
        ...pForm,
        price: parseFloat(pForm.price),
        regularPrice: parseFloat(pForm.regularPrice),
        stock: parseInt(pForm.stock)
      });
      setActiveSection('products');
    };

    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
        <div className="mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tight">New Hub Listing</h2>
          <p className="text-slate-500 font-medium">Add a new high-performance gadget to your catalog.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name</label>
              <input required value={pForm.name} onChange={e => setPForm({...pForm, name: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SKU Code</label>
              <input required value={pForm.sku} onChange={e => setPForm({...pForm, sku: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regular Price (৳)</label>
              <input required type="number" value={pForm.regularPrice} onChange={e => setPForm({...pForm, regularPrice: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Price (৳)</label>
              <input required type="number" value={pForm.price} onChange={e => setPForm({...pForm, price: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Quantity</label>
              <input required type="number" value={pForm.stock} onChange={e => setPForm({...pForm, stock: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
              <select value={pForm.category} onChange={e => setPForm({...pForm, category: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold appearance-none">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Images (Multiple)</label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {pForm.images.map((img, i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setPForm(prev => ({...prev, images: prev.images.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                <Plus className="h-6 w-6 text-slate-400 mb-1" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleImgUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea required rows={5} value={pForm.description} onChange={e => setPForm({...pForm, description: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
          </div>

          <div className="flex items-center space-x-3">
            <input type="checkbox" id="featured" checked={pForm.isFeatured} onChange={e => setPForm({...pForm, isFeatured: e.target.checked})} className="w-5 h-5 rounded-lg text-primary-600 focus:ring-primary-500" />
            <label htmlFor="featured" className="text-sm font-bold text-slate-700 dark:text-slate-300">Feature this product on homepage</label>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
              Publish Gadget
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderLandingPages = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Landing Pages</h2>
          <p className="text-slate-500 font-medium">Create custom marketing pages for your campaigns.</p>
        </div>
        <button 
          onClick={() => openLandingModal()}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:scale-105 transition-all"
        >
          Create Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {landingPages.map(page => (
          <div key={page.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <Globe className="h-6 w-6 text-primary-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${page.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {page.status}
              </span>
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-2">{page.title}</h4>
            <p className="text-xs text-slate-400 font-bold mb-6">/{page.slug}</p>
            <div className="flex space-x-2">
              <button onClick={() => openLandingModal(page)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">Edit</button>
              <button onClick={() => adminDeleteLandingPage(page.id)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {landingPages.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Globe className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-bold">No landing pages created yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Marketing Campaigns</h2>
          <p className="text-slate-500 font-medium">Drive sales with targeted discounts and coupons.</p>
        </div>
        <button 
          onClick={() => openCampaignModal()}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:scale-105 transition-all"
        >
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {campaigns.map(cp => (
          <div key={cp.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className={`p-2 rounded-xl ${cp.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                <Megaphone className="h-5 w-5" />
              </div>
            </div>
            <div className="mb-8 flex items-center gap-6">
              {cp.image && (
                <div className="w-24 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img src={cp.image} className="w-full h-full object-cover" alt="" />
                </div>
              )}
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tight mb-1">{cp.name}</h4>
                <p className="text-xs text-slate-400 font-bold">Ends on {new Date(cp.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coupon Code</p>
                <p className="font-black text-primary-600 text-xl">{cp.couponCode}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount</p>
                <p className="font-black text-slate-900 dark:text-white text-xl">{cp.discountValue}{cp.discountType === 'percentage' ? '%' : '৳'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex space-x-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uses</p>
                  <p className="font-bold">{cp.performance.uses}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                  <p className="font-bold">৳{cp.performance.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => openCampaignModal(cp)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><Edit className="h-5 w-5" /></button>
                <button onClick={() => adminDeleteCampaign(cp.id)} className="p-3 hover:bg-red-50 text-red-600 rounded-xl transition-all"><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">Review Management</h2>
        <p className="text-slate-500 font-medium">Monitor and respond to customer feedback.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Rating</th>
                <th className="px-8 py-4">Comment</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6 font-bold text-sm">{review.productName}</td>
                  <td className="px-8 py-6 font-bold text-sm">{review.userName}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'opacity-20'}`} />)}
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <p className="text-xs text-slate-500 line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                       <button onClick={() => adminUpdateReview(review.id, { status: 'approved' })} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Check className="h-4 w-4" /></button>
                       <button onClick={() => adminUpdateReview(review.id, { status: 'rejected' })} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"><X className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">User Database</h2>
        <p className="text-slate-500 font-medium">Manage and control all registered hub members.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-8 py-4">User Info</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-primary-600">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium">{u.email || 'No Email'}</p>
                    <p className="text-xs text-slate-400">{u.phone || 'No Phone'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => { if(confirm('Remove this user?')) adminDeleteUser(u.id); }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => {
    const handleUpdateCredentials = async (e: React.FormEvent) => {
      e.preventDefault();
      await adminUpdateCredentials({ email: adminEmail, password: newAdminPassword });
      setNewAdminPassword('');
    };

    return (
      <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom duration-500">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Hub Settings</h2>
          <p className="text-slate-500 font-medium">Manage administrative credentials and security.</p>
        </div>

        <form onSubmit={handleUpdateCredentials} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Email</label>
            <input 
              type="email" 
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Master Password</label>
            <input 
              type="password" 
              value={newAdminPassword}
              onChange={e => setNewAdminPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all">
              <Save className="h-4 w-4" /> Update Credentials
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center space-x-4 mb-12">
            <div className="h-12 w-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">Hub Console</h1>
              <p className="text-[8px] font-black text-primary-600 uppercase tracking-widest">Master Control</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeSection === item.id 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' 
                    : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Administrator</p>
              </div>
              <button onClick={() => window.location.href = '#/'} className="p-2 hover:text-primary-600"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto h-screen no-scrollbar">
        <div className="max-w-7xl mx-auto">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'sliders' && renderSliders()}
          {activeSection === 'categories' && renderCategories()}
          {activeSection === 'orders' && renderOrders()}
          {activeSection === 'abandoned' && renderAbandonedCarts()}
          {activeSection === 'products' && renderAllProducts()}
          {activeSection === 'new-product' && renderNewProduct()}
          {activeSection === 'landing' && renderLandingPages()}
          {activeSection === 'campaigns' && renderCampaigns()}
          {activeSection === 'reviews' && renderReviews()}
          {activeSection === 'users' && renderUsers()}
          {activeSection === 'settings' && renderSettings()}
        </div>
      </main>

      {/* Generic Modal for Details/Forms */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  {editingItem ? 'Edit' : 'Add New'} {modalType}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-6">
                {modalType === 'order' && editingItem && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Info</p>
                        <p className="font-bold">{editingItem.customerDetails.fullName}</p>
                        <p className="text-sm text-slate-500">{editingItem.customerDetails.email}</p>
                        <p className="text-sm text-slate-500">{editingItem.customerDetails.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Address</p>
                        <p className="text-sm font-medium leading-relaxed">{editingItem.customerDetails.address}</p>
                      </div>
                    </div>
                    <div className="border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <tr>
                            <th className="px-6 py-3">Item</th>
                            <th className="px-6 py-3">Qty</th>
                            <th className="px-6 py-3 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {editingItem.items.map((item: any, i: number) => (
                            <tr key={i} className="text-sm">
                              <td className="px-6 py-4 font-bold">{item.name}</td>
                              <td className="px-6 py-4 text-slate-500">{item.quantity}</td>
                              <td className="px-6 py-4 text-right font-black">৳{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            <td colSpan={2} className="px-6 py-4 font-black uppercase tracking-widest text-xs">Total</td>
                            <td className="px-6 py-4 text-right text-xl font-black text-primary-600">৳{editingItem.total.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Add more form fields for other modal types as needed */}
                {modalType === 'landing' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page Title</label>
                      <input value={lpForm.title} onChange={e => setLpForm({...lpForm, title: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug (URL)</label>
                      <input value={lpForm.slug} onChange={e => setLpForm({...lpForm, slug: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Title</label>
                        <input value={lpForm.seoTitle} onChange={e => setLpForm({...lpForm, seoTitle: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                        <select value={lpForm.status} onChange={e => setLpForm({...lpForm, status: e.target.value as any})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Description</label>
                      <textarea value={lpForm.seoDescription} onChange={e => setLpForm({...lpForm, seoDescription: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" rows={3} />
                    </div>
                  </div>
                )}

                {modalType === 'campaign' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Banner (Long & Thin)</label>
                      <label className="w-full h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                        {cpForm.image ? (
                          <img src={cpForm.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <>
                            <Plus className="h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Upload Banner</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCpForm(prev => ({ ...prev, image: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Name</label>
                      <input value={cpForm.name} onChange={e => setCpForm({...cpForm, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coupon Code</label>
                        <input value={cpForm.couponCode} onChange={e => setCpForm({...cpForm, couponCode: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                        <select value={cpForm.status} onChange={e => setCpForm({...cpForm, status: e.target.value as any})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Type</label>
                        <select value={cpForm.discountType} onChange={e => setCpForm({...cpForm, discountType: e.target.value as any})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold">
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (৳)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Value</label>
                        <input type="number" value={cpForm.discountValue} onChange={e => setCpForm({...cpForm, discountValue: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                        <input type="date" value={cpForm.startDate} onChange={e => setCpForm({...cpForm, startDate: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                        <input type="date" value={cpForm.endDate} onChange={e => setCpForm({...cpForm, endDate: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'category' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category Name</label>
                      <input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category Icon/Image</label>
                      <label className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                        {catForm.image ? (
                          <img src={catForm.image} className="w-full h-full object-contain" alt="" />
                        ) : (
                          <>
                            <Plus className="h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Upload Icon</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCatForm(prev => ({ ...prev, image: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                      <select value={catForm.status} onChange={e => setCatForm({...catForm, status: e.target.value as any})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-8">
                <button onClick={handleModalSubmit} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-95">Save Changes</button>
                <button onClick={() => { setIsModalOpen(false); setEditingItem(null); }} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
