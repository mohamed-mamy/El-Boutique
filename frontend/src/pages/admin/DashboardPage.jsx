import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../config/axios';
import StatCard from '../../components/admin/StatCard';
import { Package, Grid, Tag, ShoppingBag, RefreshCw, Eye } from 'lucide-react';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-primary-400 w-8 h-8" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-6 py-10 fade-in">
      <div className="flex justify-between items-center border-b border-primary-200 pb-6">
        <h1 className="text-3xl font-serif text-primary-900 tracking-wide">{t('admin.dashboard', 'Dashboard')}</h1>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-medium text-primary-700 bg-white border border-primary-200 hover:bg-primary-50 focus:outline-none transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
          {t('common.refresh', 'Refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('admin.total_products', 'Total Products')}
          value={stats?.totalProducts || 0}
          icon={Package}
        />
        <StatCard
          title={t('admin.total_orders', 'Total Orders')}
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
        />
        <StatCard
          title={t('admin.categories', 'Categories')}
          value={stats?.totalCategories || 0}
          icon={Grid}
        />
        <StatCard
          title={t('admin.brands', 'Brands')}
          value={stats?.totalBrands || 0}
          icon={Tag}
        />
      </div>

      <div className="mt-12 bg-white border border-primary-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-primary-200 bg-primary-50/50">
          <h3 className="text-lg font-serif text-primary-900 tracking-wide">{t('admin.most_viewed_products', 'Most Viewed Products')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">
                  {t('admin.product', 'Product')}
                </th>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">
                  {t('admin.price', 'Price')}
                </th>
                <th scope="col" className="px-6 py-4 text-start text-[11px] font-medium text-primary-500 uppercase tracking-widest">
                  {t('admin.views', 'Views')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-100">
              {stats?.topViewedProducts?.length > 0 ? (
                stats.topViewedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-10 bg-primary-100 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img className="h-full w-full object-cover" src={product.images[0].url} alt="" />
                          ) : (
                            <Package className="h-5 w-5 text-primary-400 m-2.5" strokeWidth={1.5} />
                          )}
                        </div>
                        <div className="ms-5">
                          <div className="text-sm font-medium text-primary-900">{product.nameFr}</div>
                          <div className="text-xs text-primary-500 mt-0.5">{product.nameAr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-primary-900">{product.price} MRU</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center text-sm text-primary-600">
                        <Eye className="w-4 h-4 me-2" strokeWidth={1.5} />
                        {product.viewCount}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-primary-500 font-light">
                    {t('products.no_products', 'No products found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
