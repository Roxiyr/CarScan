import { PredictionResult } from './PredictionResult';
import { LoadingSpinner } from './LoadingSpinner';

export const ResultSection = ({ prediction, isLoading, onReset }) => {
  if (!prediction && !isLoading) return null;

  return (
    <section id="results" className="section-card section-result">
      <div className="section-header">
        <div>
          <p className="section-label">Result</p>
          <h2 className="section-title">Hasil prediksi mobil Anda</h2>
          <p className="section-description">
            Lihat entri terbaik dan confidence secara visual.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="result-loading-card">
          <LoadingSpinner />
        </div>
      ) : (
        <PredictionResult data={prediction} onReset={onReset} />
      )}
    </section>
  );
};
