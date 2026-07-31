import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/axios';

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const { i18n, t } = useTranslation();
  const isEdit = !!category;
  const lang = i18n.language === 'ar' ? 'Ar' : 'Fr';
  
  const [formData, setFormData] = useState({
    nameAr: category?.nameAr || '',
    nameFr: category?.nameFr || '',
    isActive: category ? category.isActive : true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const nameField = `name${lang}`;
    if (!formData[nameField]?.trim()) {
      const errorMsg = i18n.language === 'ar' ? 'الاسم مطلوب' : 'Le nom est requis';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/categories/${category._id}`, formData);
        toast.success(t('admin.category_updated'));
      } else {
        await api.post('/categories', formData);
        toast.success(t('admin.category_created'));
      }
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('admin.failed_save_category');
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEdit ? t('admin.edit_category') : t('admin.add_category_modal')}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.name')}
              </label>
              <input
                type="text"
                name={`name${lang}`}
                required
                value={formData[`name${lang}`]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>


            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                {t('admin.active_visible')}
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  isEdit ? t('admin.save_changes') : t('admin.add_category_modal')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
