import { useRef } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';

export const ImageUpload = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef(null);
  const { isDragActive, handleDrag, handleDrop, preview, image, reset } =
    useImageUpload();

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      // Store preview juga
      const reader = new FileReader();
      reader.onloadend = () => {
        // onImageSelect handle preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-primary bg-blue-50'
              : 'border-gray-300 bg-gray-50'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-gray-700 font-medium">
                Drag and drop gambar mobil Anda di sini
              </p>
              <p className="text-gray-500 text-sm mt-1">atau</p>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Browse file
            </button>
            <p className="text-gray-400 text-xs">
              Supports JPG, PNG up to 10 MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={isLoading}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-96 object-cover"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={reset}
            className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
          >
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  );
};
