import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2 } from 'lucide-react';
import api from '../../config/axios';
import ImageUpload from '../../components/common/ImageUpload';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    storeName: '',
    logo: null,
    whatsappNumber: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      tiktok: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data.success && response.data.data) {
          const settings = response.data.data;
          setFormData({
            storeName: settings.storeName || '',
            logo: settings.logo || null,
            whatsappNumber: settings.whatsappNumber || '',
            socialLinks: {
              facebook: settings.socialLinks?.facebook || '',
              instagram: settings.socialLinks?.instagram || '',
              tiktok: settings.socialLinks?.tiktok || ''
            }
          });
        }
      } catch (err) {
        setError(t('admin.settings_load_failed', 'Failed to load settings'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialPlatform = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (imageData) => {
    setFormData({ ...formData, logo: imageData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await api.put('/settings', formData);
      if (response.data.success) {
        setSuccess(t('admin.settings_saved', 'Settings saved successfully!'));
        // clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('admin.settings_failed', 'Failed to save settings'));
    } finally {
      setIsSaving(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.settings', 'Store Settings')}</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-4">{t('admin.general_info', 'General Information')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.store_name', 'Store Name')}</label>
              <input
                type="text"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder={t('admin.store_name_placeholder', 'e.g. El Boutique')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.whatsapp_number', 'WhatsApp Number')}</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="+213555555555"
              />
              <p className="mt-1 text-xs text-gray-500">{t('admin.whatsapp_help', 'Include country code. This number will receive orders.')}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.store_logo', 'Store Logo')}</label>
            <div className="w-48">
              <ImageUpload
                value={formData.logo}
                onChange={handleImageChange}
                folder="el-boutique/settings"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-4">{t('admin.social_links', 'Social Media Links')}</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.facebook_url', 'Facebook URL')}</label>
              <input
                type="url"
                name="social_facebook"
                value={formData.socialLinks.facebook}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.instagram_url', 'Instagram URL')}</label>
              <input
                type="url"
                name="social_instagram"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.tiktok_url', 'TikTok URL')}</label>
              <input
                type="url"
                name="social_tiktok"
                value={formData.socialLinks.tiktok}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="https://tiktok.com/@..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pb-12">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {t('admin.save_settings', 'Save Settings')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
