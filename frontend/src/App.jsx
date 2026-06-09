import { useState } from 'react'
import './index.css'
import { ImageUpload } from './components/ImageUpload'
import { PredictionResult } from './components/PredictionResult'
import { LoadingSpinner } from './components/LoadingSpinner'
import { carClassificationApi } from './services/carClassificationApi'

function App() {
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageSelect = async (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    setIsLoading(true)
    setError(null)
    try {
      const result = await carClassificationApi.classifyImage(file)
      setPrediction(result)
    } catch (err) {
      setError(err.message || 'Terjadi error saat classify image')
      setPreview(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPrediction(null)
    setPreview(null)
    setError(null)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-block">
            <div className="brand-icon">C</div>
            <div>
              <div className="brand-title">CarScan</div>
              <div className="brand-subtitle">AI Car Classifier</div>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#upload">Upload</a>
            <a href="#results">Result</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <main className="page-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="hero-badge">FastAPI · TensorFlow · Vite</span>
            <h1 className="hero-title">Kenali merek dan model mobil hanya dengan satu foto.</h1>
            <p className="hero-text">Upload foto mobil Anda, biarkan AI memprosesnya, dan dapatkan hasil prediksi lengkap beserta tingkat keyakinan dalam detik.</p>
            <div className="hero-actions">
              <a href="#upload" className="btn btn-primary">Upload Foto</a>
              <button onClick={handleReset} className="btn btn-secondary">Reset Data</button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-stats">
              <div>
                <span className="label-md">Uploads</span>
                <p>48 classes</p>
              </div>
              <div>
                <span className="label-md">Status</span>
                <p>{isLoading ? 'Menganalisis...' : prediction ? 'Selesai' : 'Siap'}</p>
              </div>
            </div>
            <div className="hero-status">
              <span className="status-dot"></span>
              Backend aktif di <strong>http://localhost:8001</strong>
            </div>
          </div>
        </section>

        <section id="upload" className="upload-panel">
          <div className="content-card">
            <div className="upload-grid">
              <div>
                <h2>Upload foto mobilmu</h2>
                <p className="section-text">File upload akan dikirim ke FastAPI backend untuk prediksi model mobil.</p>
                <div className="upload-wrapper">
                  <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
                </div>
              </div>

              <aside className="info-card">
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
                    <li>Gunakan foto mobil yang jelas</li>
                    <li>Dukungan: JPG, PNG</li>
                    <li>Maksimal: 10 MB</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert-box alert-error">{error}</div>
        )}

        {isLoading && (
          <div className="status-card">
            <LoadingSpinner />
          </div>
        )}

        {prediction && !isLoading && (
          <section id="results" className="result-panel">
            <PredictionResult data={prediction} onReset={handleReset} />
          </section>
        )}

        <section id="about" className="about-panel">
          <h2>Cara kerjanya</h2>
          <div className="about-grid">
            <div className="about-card">
              <p className="about-step">1. Upload</p>
              <p>Pilih foto mobil dan kirim ke backend.</p>
            </div>
            <div className="about-card">
              <p className="about-step">2. Model</p>
              <p>Backend memproses dengan model TensorFlow.</p>
            </div>
            <div className="about-card">
              <p className="about-step">3. Hasil</p>
              <p>Lihat prediksi utama dan top-5 kelas.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
