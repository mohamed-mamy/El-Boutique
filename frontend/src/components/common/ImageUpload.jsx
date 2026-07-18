import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../config/axios';

const ImageUpload = ({ value, onChange, folder = 'general' }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('admin.file_size_error', 'File size must be less than 5MB'));
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(t('admin.file_type_error', 'Only JPG, PNG, and WebP are allowed'));
      return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    try {
      const response = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        onChange(response.data.data); // { url, publicId }
      }
    } catch (err) {
      setError(err.response?.data?.message || t('admin.upload_failed', 'Failed to upload image'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value?.publicId) {
      onChange(null);
      return;
    }
    
    // We don't necessarily delete from backend here unless we want to,
    // usually we just remove from form and handle backend deletion on save or let it orphan.
    // For simplicity, we just remove from the form state.
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {value?.url ? (
        <div className="relative inline-block border rounded-lg overflow-hidden bg-gray-50">
          <img src={value.url} alt="Preview" className="h-32 w-auto object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isUploading ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50 border-gray-300'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 text-gray-500">
              <Loader2 className="animate-spin w-8 h-8" />
              <span className="text-sm">{t('admin.uploading', 'Uploading...')}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-gray-500">
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">{t('admin.click_to_upload', 'Click to upload image')}</span>
              <span className="text-xs">{t('admin.image_format_help', 'JPG, PNG, WebP up to 5MB')}</span>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
