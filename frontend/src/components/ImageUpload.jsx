import { useRef } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';

export const ImageUpload = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef(null);
  const { isDragActive, handleDrag, handleDrop, preview, reset } = useImageUpload();

  const handleDropWrapper = (e) => {
    handleDrop(e);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      onImageSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="upload-card">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDropWrapper}
          className={`upload-dropzone ${isDragActive ? 'drag-active' : ''} ${isLoading ? 'disabled' : ''}`}
        >
          <div className="upload-illustration">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="upload-content">
            <p className="upload-title">Drag and drop gambar mobil Anda di sini</p>
            <p className="upload-subtitle">atau</p>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary"
            >
              Browse file
            </button>
            <p className="upload-help">Supports JPG, PNG up to 10 MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={isLoading}
            className="file-input"
          />
        </div>
      ) : (
        <div className="preview-card">
          <img
            src={preview}
            alt="Preview"
            className="preview-image"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={reset}
            className="btn btn-clear"
          >
            ✕ Clear
          </button>
        </div>
      )}
    </div>
  );
};
