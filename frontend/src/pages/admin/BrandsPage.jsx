import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../config/axios';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import BrandForm from '../../components/admin/BrandForm';
import EmptyState from '../../components/common/EmptyState';

const BrandsPage = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await api.get('/brands');
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = () => {
    setSelectedBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (brand) => {
    setSelectedBrand(brand);
    setIsConfirmOpen(true);
    setError('');
  };

  const handleConfirmDelete = async () => {
    if (!selectedBrand) return;
    setIsDeleting(true);
    setError('');
    
    try {
      const response = await api.delete(`/brands/${selectedBrand._id}`);
      if (response.data.success) {
        setBrands(brands.filter((b) => b._id !== selectedBrand._id));
        setIsConfirmOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete brand');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchBrands();
  };

  if (loading && brands.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.brands', 'Brands')}</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <Plus size={16} />
          {t('admin.add_brand', 'Add Brand')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>

                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.name', 'Name')} (FR / AR)
                </th>
                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.status', 'Status')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{brand.nameFr}</div>
                    <div className="text-sm text-gray-500">{brand.nameAr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {brand.isActive ? t('admin.active', 'Active') : t('admin.inactive', 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="p-1.5 text-primary-500 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(brand)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-0 py-0">
                    <EmptyState 
                      title="No brands found" 
                      description="Get started by creating your first product brand."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forms and Modals */}
      {isFormOpen && (
        <BrandForm 
          brand={selectedBrand} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        message={
          error ? (
            <span className="text-red-600 font-medium">{error}</span>
          ) : (
            `Are you sure you want to delete "${selectedBrand?.nameFr}"? This action cannot be undone.`
          )
        }
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BrandsPage;
