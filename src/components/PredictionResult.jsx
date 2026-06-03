export const PredictionResult = ({ data, onReset }) => {
  if (!data) return null;

  const { class: carClass, confidence, allClasses } = data;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        PREDICTION RESULT
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Prediction */}
        <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">CAR TYPE DETECTED</div>
          <div className="text-4xl font-bold text-primary mb-2">{carClass}</div>
          <div className="text-lg text-gray-700">
            Confidence{' '}
            <span className="font-bold">{(confidence * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* All Classes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            All Classes
          </h3>
          <div className="space-y-3">
            {Object.entries(allClasses)
              .sort(([, a], [, b]) => b - a)
              .map(([className, percentage], index) => (
                <div key={className}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{className}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {(percentage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        className === carClass ? 'bg-primary' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-8 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        Classify Another Image
      </button>
    </div>
  );
};
