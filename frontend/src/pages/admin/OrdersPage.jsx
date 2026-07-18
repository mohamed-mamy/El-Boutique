import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../config/axios';
import { Eye, Loader2, MessageCircle, Trash2 } from 'lucide-react';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders', {
        params: {
          page,
          limit: 15,
          status: statusFilter || undefined
        }
      });
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Refresh to ensure data consistency
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await api.delete(`/orders/${orderId}`);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 fade-in">
      <div className="flex justify-between items-center flex-wrap gap-6 border-b border-primary-200 pb-6">
        <h1 className="text-3xl font-serif text-primary-900 tracking-wide">{t('admin.orders', 'Orders')}</h1>
        <div className="flex items-center gap-3">
          <label className="text-[11px] uppercase tracking-[0.1em] font-medium text-primary-500">{t('admin.filter', 'Filter:')}</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border-primary-200 bg-white text-primary-900 text-sm py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="">{t('admin.all_orders', 'All Orders')}</option>
            <option value="pending">{t('admin.pending', 'Pending')}</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">{t('admin.completed', 'Completed')}</option>
            <option value="cancelled">{t('admin.cancelled', 'Cancelled')}</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-primary-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200">
            <thead className="bg-primary-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">{t('admin.order_id', 'Order ID')}</th>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">{t('admin.date', 'Date')}</th>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">{t('admin.customer', 'Customer')}</th>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">{t('admin.total', 'Total')}</th>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">{t('admin.status', 'Status')}</th>
                <th scope="col" className="px-6 py-4 text-right text-[11px] font-medium text-primary-500 uppercase tracking-widest">{t('admin.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <Loader2 className="animate-spin text-primary-400 w-8 h-8 mx-auto" strokeWidth={1.5} />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-0 py-0">
                    <EmptyState 
                      title="No orders found" 
                      description={statusFilter ? `No orders with status "${statusFilter}" were found.` : "You haven't received any orders yet."}
                    />
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-primary-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-primary-600 font-light">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-900">{order.customerName}</div>
                      <div className="text-xs text-primary-500 mt-0.5">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-primary-900">
                      {order.totalAmount || order.totalPrice} MRU
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-[10px] uppercase tracking-wider font-medium px-3 py-1.5 focus:outline-none cursor-pointer border ${
                          order.status === 'pending' ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]' :
                          order.status === 'confirmed' ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]' :
                          order.status === 'completed' ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' :
                          'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-4 items-center">
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(order.customerName)}, regarding your order #${order._id.slice(-6).toUpperCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-[#15803d] transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle size={18} strokeWidth={1.5} />
                        </a>
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="text-primary-400 hover:text-primary-900 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-primary-400 hover:text-accent-600 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-primary-200 bg-primary-50/50 flex items-center justify-between">
            <span className="text-sm text-primary-600">
              Page <span className="font-medium text-primary-900">{pagination.page}</span> of <span className="font-medium text-primary-900">{pagination.pages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-primary-200 bg-white text-[11px] uppercase tracking-wider font-medium text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 border border-primary-200 bg-white text-[11px] uppercase tracking-wider font-medium text-primary-700 hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
