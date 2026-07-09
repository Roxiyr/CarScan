import * as tf from '@tensorflow/tfjs';

let modelPromise = null;
let configPromise = null;

/**
 * Muat model TensorFlow.js dan metadata kelas dari folder public.
 */
export async function loadCarModel() {
  if (!modelPromise) {
    modelPromise = tf.loadLayersModel('/tfjs_model/model.json');
  }
  if (!configPromise) {
    configPromise = fetch('/model_config.json').then((r) => {
      if (!r.ok) throw new Error('model_config.json tidak ditemukan. Jalankan: python export_model.py');
      return r.json();
    });
  }

  const [model, config] = await Promise.all([modelPromise, configPromise]);
  return { model, config };
}

/**
 * Preprocess gambar sama seperti backend: maintain aspect ratio + padding putih.
 */
export function preprocessImage(imageElement, imgSize) {
  const [targetH, targetW] = imgSize;
  const srcW = imageElement.naturalWidth || imageElement.width;
  const srcH = imageElement.naturalHeight || imageElement.height;
  const scale = Math.min(targetW / srcW, targetH / srcH);
  const newW = Math.round(srcW * scale);
  const newH = Math.round(srcH * scale);

  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement);

    tensor = tf.image.resizeBilinear(tensor, [newH, newW]);

    const padTop = Math.floor((targetH - newH) / 2);
    const padBottom = targetH - newH - padTop;
    const padLeft = Math.floor((targetW - newW) / 2);
    const padRight = targetW - newW - padLeft;

    tensor = tf.pad(tensor, [
      [padTop, padBottom],
      [padLeft, padRight],
      [0, 0],
    ], 255);

    return tensor
      .toFloat()
      .div(255.0)
      .expandDims(0);
  });
}

function confidenceLevel(conf) {
  if (conf >= 0.85) return { level: 'Sangat Yakin', color: 'green' };
  if (conf >= 0.60) return { level: 'Cukup Yakin', color: 'orange' };
  if (conf >= 0.40) return { level: 'Kurang Yakin', color: 'yellow' };
  return { level: 'Tidak Yakin', color: 'red' };
}

/**
 * Prediksi lokal di browser menggunakan TensorFlow.js.
 */
export async function predictLocally(imageElement) {
  const { model, config } = await loadCarModel();
  const tensor = preprocessImage(imageElement, config.img_size);
  const predictions = await model.predict(tensor).data();
  tensor.dispose();

  const classNames = config.class_names || Object.values(config.idx_to_class);
  const maxTop = Math.min(5, classNames.length);

  const top5Idx = Array.from(predictions)
    .map((prob, idx) => ({ prob, idx }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, maxTop);

  const top5 = top5Idx.map(({ prob, idx }) => ({
    merek_model: classNames[idx],
    confidence: Math.round(prob * 10000) / 10000,
    confidence_persen: `${(prob * 100).toFixed(1)}%`,
  }));

  const bestConf = top5[0].confidence;
  const { level, color } = confidenceLevel(bestConf);

  return {
    prediksi_utama: top5[0].merek_model,
    confidence: bestConf,
    confidence_persen: `${(bestConf * 100).toFixed(1)}%`,
    confidence_level: level,
    confidence_color: color,
    top5,
    source: 'browser',
  };
}
