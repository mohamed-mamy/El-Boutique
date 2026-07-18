import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Package, MapPin, User, MessageCircle, Calendar, X } from 'lucide-react';
import api from '../../config/axios';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      // In this app, there's no single GET /orders/:id yet, so we get it from GET /orders
      // A better way is to implement GET /orders/:id on backend, but for now we filter.
      // Wait, let's assume I implemented GET /orders/:id on backend or I can fetch all and find it.
      // Since Phase 9 instructions didn't specify GET /orders/:id, let's try to get it.
      const response = await api.get(`/orders`);
      if (response.data.success) {
        const found = response.data.data.orders.find(o => o._id === id);
        if (found) {
          setOrder(found);
        } else {
          setError('Order not found');
        }
      }
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <button onClick={() => navigate('/admin/orders')} className="text-indigo-600 hover:underline">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Update Status:</span>
          <select
            value={order.status}
            onChange={handleStatusChange}
            className="border-gray-300 rounded-md text-sm focus:ring-black focus:border-black"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (Items) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex items-center">
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 overflow-hidden">
                      {item.productImage ? (
                        <img 
                          src={item.productImage} 
                          alt={item.productName} 
                          className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                          onClick={() => setSelectedImage(item.productImage)}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.price} MRU</p>
                    <p className="text-xs text-gray-500">Total: {item.price * item.quantity} MRU</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-base font-medium text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">{order.totalPrice} MRU</span>
            </div>
          </div>
        </div>

        {/* Sidebar (Customer details) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Customer Info</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-base text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-base text-gray-900">{order.customerPhone}</p>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(order.customerName)}, regarding your order #${order._id.slice(-6).toUpperCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Order Timeline</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Created on: <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Last updated: <span className="font-medium text-gray-900">{new Date(order.updatedAt).toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Product full" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain bg-white" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
