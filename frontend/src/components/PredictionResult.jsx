export const PredictionResult = ({ data, onReset }) => {
  if (!data) return null;

  // Support backend response shape (`prediksi_utama`, `confidence`, `top5`)
  const carClass = data.prediksi_utama || data.class || data.label || 'Unknown';
  const confidence = data.confidence ?? (data.score || 0);

  // Build a top5 array in a consistent shape: { name, confidence }
  let top5 = [];
  if (data.top5 && Array.isArray(data.top5)) {
    top5 = data.top5.map((t) => ({ name: t.merek_model || t.label || t.class || t.name, confidence: t.confidence ?? t.probability ?? 0 }));
  } else if (data.allClasses && typeof data.allClasses === 'object') {
    top5 = Object.entries(data.allClasses)
      .map(([name, pct]) => ({ name, confidence: pct }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <div>
          <p className="prediction-label">Prediction result</p>
          <h2 className="prediction-title">Hasil klasifikasi mobil</h2>
        </div>
        <div className="prediction-badge">{Math.round(confidence * 100)}%</div>
      </div>

      <div className="prediction-grid">
        <div className="prediction-summary">
          <p className="summary-label">Detected class</p>
          <p className="summary-value">{carClass}</p>
          <p className="summary-help">Model memperkirakan jenis mobil ini dengan confidence tinggi berdasarkan fitur visual utama.</p>
        </div>

        <div className="prediction-list-card">
          <div className="prediction-list-header">
            <div>
              <p className="text-sm font-semibold text-slate-800">Top predictions</p>
              <span className="text-xs text-slate-500">Ranked by confidence</span>
            </div>
            <span className="prediction-meta">Top 5 teratas</span>
          </div>

          <div className="prediction-list">
            {top5.length === 0 ? (
              <div className="prediction-empty">Tidak ada detail prediksi yang tersedia.</div>
            ) : (
              top5.map((t) => {
                const score = Math.min(Math.max(Number(t.confidence) * 100, 0), 100);
                const isPrimary = t.name === carClass;
                return (
                  <div key={t.name} className="prediction-item">
                    <div className="prediction-item-main">
                      <span className={`prediction-item-name ${isPrimary ? 'active' : ''}`}>{t.name}</span>
                      <span className="prediction-item-percent">{score.toFixed(1)}%</span>
                    </div>
                    <div className="prediction-progress-bar">
                      <div className={`prediction-progress-fill ${isPrimary ? 'active' : ''}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <button type="button" onClick={onReset} className="prediction-reset">
        Classify another image
      </button>
    </div>
  );
};
