
import React, { useState } from 'react';
import { useApp } from '../store';
import { Package, Clock, CheckCircle, ChevronLeft, ShoppingBag, Trash2, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
  const { orders, user, deleteOrder, updateOrder } = useApp();
  const navigate = useNavigate();
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({ address: '', phone: '' });

  const userOrders = orders.filter(o => o.userId === user?.id);

  const handleEditClick = (order: any) => {
    setEditingOrder(order);
    setEditForm({ 
      address: order.customerDetails.address, 
      phone: order.customerDetails.phone || '' 
    });
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    await updateOrder(editingOrder.id, {
      customerDetails: {
        ...editingOrder.customerDetails,
        address: editForm.address,
        phone: editForm.phone
      }
    });
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      await deleteOrder(orderId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors font-bold">
        <ChevronLeft className="h-5 w-5 mr-1" /> Back
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">My Gadget Orders</h1>
        <p className="text-slate-500 font-medium">Track and manage your Neeedy purchases.</p>
      </div>

      <div className="space-y-6">
        {userOrders.length > 0 ? (
          userOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight">{order.id}</h4>
                  <div className="pt-2 text-xs text-slate-500 font-medium space-y-1">
                    <p>Address: <span className="text-slate-900 dark:text-white">{order.customerDetails.address}</span></p>
                    <p>Phone: <span className="text-slate-900 dark:text-white">{order.customerDetails.phone}</span></p>
                    <p>Payment: <span className="text-slate-900 dark:text-white uppercase">{order.paymentMethod}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status === 'confirmed' || order.status === 'delivered' ? <CheckCircle className="h-4 w-4 mr-2" /> : 
                     order.status === 'cancelled' ? <ShoppingBag className="h-4 w-4 mr-2" /> :
                     <Clock className="h-4 w-4 mr-2" />}
                    {order.status}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-xl font-black text-primary-600">৳{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-sm line-clamp-1">{item.name}</h5>
                        <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} • ৳{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditClick(order)}
                      className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all"
                      title="Edit Order Details"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                      title="Cancel Order"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="inline-flex p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6">
              <ShoppingBag className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">No orders yet</h3>
            <p className="text-slate-500 font-medium mb-8">Start your tech journey by exploring our shop.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-500/30"
            >
              Explore Shop
            </button>
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tight">Edit Order Details</h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Address</label>
                <textarea 
                  value={editForm.address}
                  onChange={e => setEditForm({...editForm, address: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                <input 
                  type="text"
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border-2 border-transparent focus:border-primary-500 font-bold"
                />
              </div>

              <button 
                onClick={handleUpdateOrder}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-500/30"
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
