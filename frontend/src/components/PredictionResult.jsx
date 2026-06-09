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
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">PREDICTION RESULT</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">CAR TYPE DETECTED</div>
          <div className="text-4xl font-bold text-primary mb-2">{carClass}</div>
          <div className="text-lg text-gray-700">
            Confidence{' '}
            <span className="font-bold">{Math.round(confidence * 100) / 10}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Predictions</h3>
          <div className="space-y-3">
            {top5.length === 0 ? (
              <div className="text-sm text-gray-600">No detailed predictions available.</div>
            ) : (
              top5.map((t, idx) => (
                <div key={t.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{t.name}</span>
                    <span className="text-sm font-semibold text-gray-800">{(t.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${t.name === carClass ? 'bg-primary' : 'bg-gray-400'}`}
                      style={{ width: `${t.confidence * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button onClick={onReset} className="w-full mt-8 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold">
        Classify Another Image
      </button>
    </div>
  );
};
