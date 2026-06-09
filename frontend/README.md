# CarScan Frontend

React + Vite frontend untuk aplikasi klasifikasi mobil. Pengguna bisa upload foto mobil, melihat preview, lalu menerima hasil prediksi dari backend.

## Cara Jalankan

1. Buka terminal dan masuk ke folder `frontend`

```bash
cd frontend
```

2. Install dependensi

```bash
npm install
```

3. Jalankan frontend

```bash
npm run dev
```

4. Buka browser

```text
http://localhost:5173
```

5. Pastikan backend FastAPI sudah berjalan di `http://localhost:8001`

```bash
cd ../backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

## Environment

Buat file `.env.local` di folder `frontend`:

```env
VITE_API_URL=http://localhost:8001
```

> Vite sudah dikonfigurasi untuk mem-proxy request `/api` ke `http://localhost:8001`.

## Fitur Utama

- Upload gambar mobil dengan drag & drop
- Preview gambar sebelum submit
- Menampilkan hasil prediksi kelas mobil
- Confidence score dan detail skor semua kelas
- Loading state dan error handling
- Tailwind CSS untuk styling responsif

## Struktur Frontend

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── PredictionResult.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   └── useImageUpload.js
│   ├── services/
│   │   └── carClassificationApi.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.local
```

## API yang Dipakai

Frontend memanggil backend dengan endpoint berikut:

- `POST /api/classify` — upload gambar dan dapatkan prediksi
- `GET /api/classes` — daftar kelas mobil yang didukung
- `GET /api/model-info` — informasi model
- `GET /api/health` — health check

## Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Untuk build produksi:

```bash
npm run build
```

## Catatan Backend

Frontend ini hanya menampilkan UI. Backend Flask berada di folder `../backend`:

- `backend/app.py` untuk API
- `backend/models/` untuk model dan wrapper
- `backend/requirements.txt` untuk dependency Python

## Troubleshooting

- Jika frontend tidak bisa terhubung: pastikan backend berjalan di `http://localhost:5000`
- Jika API error: cek console browser dan log backend
- Jika `VITE_API_URL` tidak dikenali: pastikan `.env.local` ada di folder `frontend`

## Kontak Singkat

Jika ingin menambahkan fitur:
- dark mode
- history upload
- kamera real-time
- batch classify

README ini dibuat agar fokus pada penggunaan frontend dan konfigurasi sederhana.

## License

MIT

## Support

For issues, check:
1. Backend logs: `python backend/app.py`
2. Browser console: F12 → Console tab
3. API health: `curl http://localhost:5000/api/health`

---

Happy classifying! 🚗✨

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
