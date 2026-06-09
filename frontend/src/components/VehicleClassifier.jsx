// VehicleClassifier.jsx
// Install dulu: npm install @tensorflow/tfjs

import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function VehicleClassifier() {
  const [model, setModel] = useState(null);
  const [tokenizer, setTokenizer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const imgRef = useRef(null);

  // Load model dan tokenizer saat komponen mount
  useEffect(() => {
    async function loadModel() {
      try {
        const [loadedModel, tokenizerResp] = await Promise.all([
          tf.loadLayersModel("/tfjs_model/model.json"),
          fetch("/tokenizer.json").then((r) => r.json()),
        ]);
        setModel(loadedModel);
        setTokenizer(tokenizerResp);
        console.log("✅ Model & tokenizer loaded!");
      } catch (err) {
        console.error("Error loading model:", err);
      }
    }
    loadModel();
  }, []);

  // Prediksi gambar
  async function predict(imageElement) {
    if (!model || !tokenizer) return;
    setLoading(true);

    const [imgH, imgW] = tokenizer.img_size; // [64, 64]

    const tensor = tf.tidy(() => {
      return tf.browser
        .fromPixels(imageElement)
        .resizeBilinear([imgH, imgW])
        .toFloat()
        .div(255.0)
        .expandDims(0); // [1, 64, 64, 3]
    });

    const predictions = await model.predict(tensor).data();
    tensor.dispose();

    // Top-5 hasil
    const top5 = Array.from(predictions)
      .map((prob, idx) => ({
        label: tokenizer.idx_to_class[String(idx)],
        probability: prob,
        tokenId: idx,
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    setResult(top5);
    setLoading(false);
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }

  function handleImageLoad() {
    if (imgRef.current) predict(imgRef.current);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>🚗 Vehicle Classifier</h1>
      <p style={{ color: "#666" }}>48 kelas kendaraan · Model CNN · Powered by TensorFlow.js</p>

      {!model ? (
        <p>⏳ Loading model, harap tunggu...</p>
      ) : (
        <p style={{ color: "green" }}>✅ Model siap digunakan</p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={!model}
        style={{ marginTop: 16, display: "block" }}
      />

      {preview && (
        <img
          ref={imgRef}
          src={preview}
          alt="preview"
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
          style={{
            width: "100%",
            maxHeight: 320,
            objectFit: "contain",
            marginTop: 16,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />
      )}

      {loading && <p>🔍 Menganalisis gambar...</p>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>📊 Hasil Prediksi (Top 5)</h3>
          {result.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontWeight: i === 0 ? "bold" : "normal" }}>
                  {i + 1}. {r.label.replace(/_/g, " ")}
                </span>
                <span style={{ color: i === 0 ? "#4CAF50" : "#666" }}>
                  {(r.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ background: "#eee", borderRadius: 4, height: 10, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${r.probability * 100}%`,
                    background: i === 0 ? "#4CAF50" : "#90CAF9",
                    height: "100%",
                    transition: "width 0.6s ease",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
            Token ID kelas: {result[0]?.tokenId} → {result[0]?.label}
          </p>
        </div>
      )}
    </div>
  );
}
