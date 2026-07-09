export const AboutSection = () => {
  return (
    <section id="about" className="section-card section-about">
      <div className="section-header">
        <div>
          <p className="section-label">About</p>
          <h2 className="section-title">Bagaimana CarScan bekerja</h2>
          <p className="section-description">
            CarScan memproses foto mobil Anda menggunakan model TensorFlow di backend, lalu menampilkan hasil dengan prediksi top-5 kelas secara cepat.
          </p>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <p className="about-step">1. Upload</p>
          <p>Pilih foto mobil dan kirim ke backend atau browser.</p>
        </div>
        <div className="about-card">
          <p className="about-step">2. Model</p>
          <p>Backend memuat model 11 kelas dan menghitung prediksi secara akurat.</p>
        </div>
        <div className="about-card">
          <p className="about-step">3. Hasil</p>
          <p>Tampilkan prediksi utama, confidence, dan top-5 kelas.</p>
        </div>
      </div>
    </section>
  );
};
