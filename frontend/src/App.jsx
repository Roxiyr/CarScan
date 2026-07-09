import { useState, useEffect } from 'react'
import './index.css'
import { UploadSection } from './components/UploadSection'
import { ResultSection } from './components/ResultSection'
import { AboutSection } from './components/AboutSection'
import { carClassificationApi } from './services/carClassificationApi'
import { loadCarModel, predictLocally } from './services/localModel'

function App() {
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('backend')
  const [localReady, setLocalReady] = useState(false)
  const [modelInfo, setModelInfo] = useState(null)

  useEffect(() => {
    loadCarModel()
      .then(({ config }) => {
        setLocalReady(true)
        setModelInfo(config)
      })
      .catch(() => setLocalReady(false))

    carClassificationApi.getModelInfo().then(setModelInfo).catch(() => {})
  }, [])

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
      if (mode === 'local') {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        const result = await predictLocally(img)
        setPrediction(result)
        URL.revokeObjectURL(img.src)
      } else {
        const result = await carClassificationApi.classifyImage(file)
        setPrediction({ ...result, source: 'backend' })
      }
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
                <p>{modelInfo?.num_classes || modelInfo?.jumlah_kelas || '—'} classes</p>
              </div>
              <div>
                <span className="label-md">Status</span>
                <p>{isLoading ? 'Menganalisis...' : prediction ? 'Selesai' : 'Siap'}</p>
              </div>
            </div>
            <div className="hero-status">
              <span className="status-dot"></span>
              {mode === 'backend'
                ? <>Backend aktif di <strong>http://localhost:8001</strong></>
                : <>Model browser {localReady ? 'siap' : 'belum dimuat — jalankan python export_model.py'}</>}
            </div>
          </div>
        </section>

        <UploadSection
          mode={mode}
          localReady={localReady}
          onModeChange={setMode}
          onImageSelect={handleImageSelect}
          isLoading={isLoading}
          preview={preview}
          error={error}
        />

        <ResultSection prediction={prediction} isLoading={isLoading} onReset={handleReset} />

        <AboutSection />
      </main>
    </div>
  )
}

export default App
