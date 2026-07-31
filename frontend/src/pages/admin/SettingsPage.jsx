import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, Lock, Phone, Link2 } from 'lucide-react';
import api from '../../config/axios';
import ImageUpload from '../../components/common/ImageUpload';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    storeName: '',
    logo: null,
    whatsappNumber: '',
    phoneNumber: '',
    storeLink: '',
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

  const [credentials, setCredentials] = useState({
    currentPassword: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');

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
            phoneNumber: settings.phoneNumber || '',
            storeLink: settings.storeLink || '',
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
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('admin.settings_failed', 'Failed to save settings'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (credentials.newPassword && credentials.newPassword !== credentials.confirmPassword) {
      setCredError(t('admin.passwords_not_match', 'Passwords do not match'));
      return;
    }

    if (credentials.newPassword && credentials.newPassword.length < 6) {
      setCredError(t('admin.password_min_length', 'Password must be at least 6 characters'));
      return;
    }

    setIsSavingCreds(true);
    try {
      const payload = {
        currentPassword: credentials.currentPassword,
      };
      if (credentials.phone) payload.phone = credentials.phone;
      if (credentials.newPassword) payload.newPassword = credentials.newPassword;

      const response = await api.put('/auth/credentials', payload);
      if (response.data.success) {
        setCredSuccess(t('admin.credentials_saved', 'Credentials updated successfully!'));
        setCredentials({ currentPassword: '', phone: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setCredSuccess(''), 3000);
      }
    } catch (err) {
      setCredError(err.response?.data?.message || t('admin.credentials_failed', 'Failed to update credentials'));
    } finally {
      setIsSavingCreds(false);
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.phone_number', 'Phone Number')}</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="213555555555"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Link2 size={14} />
              {t('admin.store_link', 'Store Link')}
            </label>
            <input
              type="url"
              name="storeLink"
              value={formData.storeLink || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="https://el-boutique.onrender.com"
            />
            <p className="mt-1 text-xs text-gray-500">{t('admin.store_link_help', 'This link will be shown to customers to browse products and place orders.')}</p>
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
      </form>

      {/* Credentials */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
          <Lock size={18} />
          {t('admin.login_credentials', 'Login Credentials')}
        </h2>

        {credError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
            {credError}
          </div>
        )}
        {credSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium">
            {credSuccess}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.current_password', 'Current Password')} *</label>
            <input
              type="password"
              name="currentPassword"
              required
              value={credentials.currentPassword}
              onChange={handleCredentialsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={14} />
                {t('admin.new_phone', 'New Phone Number')}
              </label>
              <input
                type="text"
                name="phone"
                value={credentials.phone}
                onChange={handleCredentialsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder={t('admin.leave_empty_no_change', 'Leave empty to keep current')}
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.new_password', 'New Password')}</label>
              <input
                type="password"
                name="newPassword"
                value={credentials.newPassword}
                onChange={handleCredentialsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder={t('admin.leave_empty_no_change', 'Leave empty to keep current')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.confirm_password', 'Confirm New Password')}</label>
              <input
                type="password"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleCredentialsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingCreds}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              {isSavingCreds ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
              {t('admin.update_credentials', 'Update Credentials')}
            </button>
          </div>
        </form>
      </div>

      {/* Actions */}
      <div className="flex justify-end pb-12">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {t('admin.save_settings', 'Save Settings')}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
