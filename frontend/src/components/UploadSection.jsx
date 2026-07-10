import { ImageUpload } from './ImageUpload';

export const UploadSection = ({ mode, localReady, onModeChange, onImageSelect, isLoading, preview, setPreview, error }) => {
  return (
    <section id="upload" className="section-card section-upload">
      <div className="section-header">
        <div>
          <p className="section-label">Upload</p>
          <h2 className="section-title">Unggah foto mobilmu untuk prediksi cepat.</h2>
          <p className="section-description">
            Upload foto mobil Anda dan AI akan menganalisisnya untuk mengenali merek dan modelnya.
          </p>
        </div>
      </div>

      <div className="upload-grid">
        <div className="upload-panel">
          <ImageUpload onImageSelect={onImageSelect} isLoading={isLoading} preview={preview} />
        </div>
        <aside className="upload-info">
          <div className="info-box">
            <p className="info-label">Preview</p>
            {preview ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <div className="preview-empty">Belum ada foto dipilih.</div>
            )}
          </div>
          <div className="info-box">
            <p className="info-label">Petunjuk</p>
            <ul className="info-list">
              <li>Gunakan foto mobil yang jelas dan terfokus.</li>
              <li>Dukungan: JPG, PNG.</li>
              <li>Maksimal ukuran file: 10 MB.</li>
            </ul>
          </div>
          {error && <div className="alert-box alert-error">{error}</div>}
        </aside>
      </div>
    </section>
  );
};
