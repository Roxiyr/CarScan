import { useState, useRef, useEffect } from 'react';
import { loadCarModel, predictLocally } from '../services/localModel';

export default function VehicleClassifier() {
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    loadCarModel()
      .then(({ config: cfg }) => {
        setConfig(cfg);
        setReady(true);
      })
      .catch((err) => {
        console.error('Error loading model:', err);
        setError(err.message || 'Gagal memuat model TensorFlow.js');
      });
  }, []);

  async function runPredict() {
    if (!imgRef.current || !ready) return;
    setLoading(true);
    setError(null);
    try {
      const prediction = await predictLocally(imgRef.current);
      setResult(prediction);
    } catch (err) {
      setError(err.message || 'Prediksi gagal');
    } finally {
      setLoading(false);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>🚗 Vehicle Classifier (Browser)</h1>
      <p style={{ color: '#666' }}>
        {config
          ? `${config.num_classes} kelas · ${config.img_size[0]}×${config.img_size[1]}px · TensorFlow.js`
          : 'Memuat konfigurasi model...'}
      </p>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {!ready ? (
        <p>⏳ Loading model, harap tunggu...</p>
      ) : (
        <p style={{ color: 'green' }}>✅ Model siap digunakan di browser</p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={!ready}
        style={{ marginTop: 16, display: 'block' }}
      />

      {preview && (
        <img
          ref={imgRef}
          src={preview}
          alt="preview"
          onLoad={runPredict}
          crossOrigin="anonymous"
          style={{
            width: '100%',
            maxHeight: 320,
            objectFit: 'contain',
            marginTop: 16,
            borderRadius: 8,
            border: '1px solid #ddd',
          }}
        />
      )}

      {loading && <p>🔍 Menganalisis gambar...</p>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>📊 Hasil Prediksi (Top 5)</h3>
          <p>
            <strong>{result.prediksi_utama}</strong> — {result.confidence_persen} ({result.confidence_level})
          </p>
          {result.top5.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: i === 0 ? 'bold' : 'normal' }}>
                  {i + 1}. {r.merek_model}
                </span>
                <span style={{ color: i === 0 ? '#4CAF50' : '#666' }}>
                  {r.confidence_persen}
                </span>
              </div>
              <div style={{ background: '#eee', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${r.confidence * 100}%`,
                    background: i === 0 ? '#4CAF50' : '#90CAF9',
                    height: '100%',
                    transition: 'width 0.6s ease',
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
