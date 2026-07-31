import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import api from '../../config/axios';
import MultiImageUpload from '../../components/admin/MultiImageUpload';

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const isEdit = !!id;
  const lang = i18n.language === 'ar' ? 'Ar' : 'Fr';

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameFr: '',
    descriptionAr: '',
    descriptionFr: '',
    price: '',
    discountPrice: '',
    quantity: '',
    color: '',
    category: '',
    brand: '',
    isFeatured: false,
    isActive: true,
    images: []
  });

  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands')
        ]);
        
        if (catRes.data.success) setCategories(catRes.data.data);
        if (brandRes.data.success) setBrands(brandRes.data.data);

        if (isEdit) {
          const prodRes = await api.get(`/products/${id}`);
          if (prodRes.data.success) {
            const p = prodRes.data.data;
            setFormData({
              nameAr: p.nameAr || '',
              nameFr: p.nameFr || '',
              descriptionAr: p.descriptionAr || '',
              descriptionFr: p.descriptionFr || '',
              price: p.price || '',
              discountPrice: p.discountPrice || '',
              quantity: p.quantity || '',
              color: p.color || '',
              category: p.category?._id || p.category || '',
              brand: p.brand?._id || p.brand || '',
              isFeatured: p.isFeatured || false,
              isActive: p.isActive || false,
              images: p.images || []
            });
          }
        }
      } catch (err) {
        setError(t('admin.failed_load_data'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImagesChange = (newImages) => {
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nameField = `name${lang}`;
    const descField = `description${lang}`;

    if (!formData[nameField]?.trim()) {
      setError(i18n.language === 'ar' ? 'الاسم مطلوب' : 'Le nom est requis');
      return;
    }

    if (formData.discountPrice && Number(formData.discountPrice) >= Number(formData.price)) {
      setError(t('admin.discount_error'));
      return;
    }

    if (!formData.category) {
      setError(t('admin.category_required'));
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || t('admin.failed_save'));
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? t('admin.edit_product') : t('admin.add_new_product')}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Images Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.product_images')}</h2>
          <MultiImageUpload
            images={formData.images}
            onChange={handleImagesChange}
            maxImages={5}
            folder="el-boutique/products"
          />
          <p className="mt-2 text-sm text-gray-500">{t('admin.product_images_help')}</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">{t('admin.basic_info')}</h2>
          
          <div className="grid grid-cols-1 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.description')}
              </label>
              <textarea
                name={`description${lang}`}
                rows={4}
                value={formData[`description${lang}`]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">{t('admin.organization')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.category')}</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-white"
              >
                <option value="">{t('admin.select_category')}</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{i18n.language === 'ar' ? (c.nameAr || c.nameFr) : (c.nameFr || c.nameAr)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.brand')}</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-white"
              >
                <option value="">{t('admin.select_brand')}</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{i18n.language === 'ar' ? (b.nameAr || b.nameFr) : (b.nameFr || b.nameAr)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900">{t('admin.pricing_inventory')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.price_mru')}</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.discount_price')} <span className="text-gray-400 font-normal">({t('admin.optional')})</span></label>
              <input
                type="number"
                name="discountPrice"
                min="0"
                value={formData.discountPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.stock_quantity')}</label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.color')} <span className="text-gray-400 font-normal">({t('admin.optional')})</span></label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder={t('admin.color_placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">{t('admin.product_status')}</h2>
          
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
          
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
              {t('admin.featured_homepage')}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-12">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isEdit ? t('admin.save_changes') : t('admin.create_product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
