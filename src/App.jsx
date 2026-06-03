import { useState } from 'react'
import './index.css'
import { Header } from './components/Header'
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
    
    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Classify
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {!preview ? (
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Identify your car type instantly
            </h2>
            <p className="text-gray-600 mb-8">
              Upload a photo and our CNN model will classify it in seconds
            </p>
          </div>
        ) : null}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {!preview ? (
            <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
          ) : (
            <>
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto max-h-96 object-cover rounded-lg mb-6"
              />
              <button
                disabled={isLoading}
                onClick={handleReset}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition font-semibold"
              >
                Change Image
              </button>
            </>
          )}
        </div>

        {isLoading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 rounded mb-8">
            {error}
          </div>
        )}

        {prediction && !isLoading && (
          <PredictionResult data={prediction} onReset={handleReset} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-center text-gray-600">
        <p>© 2024 CarLens AI Classification</p>
      </footer>
    </div>
  )
}

export default App
