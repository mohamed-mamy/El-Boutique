import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import api from '../../config/axios';

const MultiImageUpload = ({ images, onChange, maxImages = 5, folder = 'general' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    try {
      const response = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        onChange([...images, ...response.data.data]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={image.publicId || index} className="relative group border rounded-lg overflow-hidden bg-gray-50 aspect-square">
            <img src={image.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
            
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
            
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black text-white text-xs rounded shadow-sm">
                Primary
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-square transition-colors ${
              isUploading ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50 border-gray-300'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2 text-gray-500">
                <Loader2 className="animate-spin w-6 h-6" />
                <span className="text-xs">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-gray-500 p-4 text-center">
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium">Add Image</span>
                <span className="text-[10px]">{images.length}/{maxImages}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default MultiImageUpload;
