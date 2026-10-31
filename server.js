const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/absen', upload.any(), (req, res) => {
  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const b = req.body || {};

  console.log("\n========== DATA BARU MASUK ==========");
  console.log("WAKTU:", waktu);
  console.log("IP:", req.ip);

  console.log("--- ISI DATA ---");
  console.log(JSON.stringify(b, null, 2));

  // Device info -- hanya tampil kalau HTML lo ikut ngirim field ini
  console.log("--- DEVICE INFO (kalau dikirim dari HTML) ---");
  console.log("OS:", b.os || '-');
  console.log("BROWSER:", b.browser || '-');
  console.log("MODEL HP:", b.modelHP || '-');
  console.log("USER AGENT:", b.userAgent || '-');
  console.log("SCREEN:", b.screen || '-');
  console.log("VIEWPORT:", b.viewport || '-');
  console.log("RAM:", b.ram || '-');
  console.log("CPU CORES:", b.cpuCores || '-');
  console.log("BATTERY:", b.battery || '-');
  console.log("LANGUAGE:", b.language || '-');
  console.log("CONNECTION:", b.connection || '-');

  if (req.files && req.files.length > 0) {
    console.log("--- FOTO ---");
    req.files.forEach(f => {
      console.log(`FOTO: https://${req.get('host')}/uploads/${f.filename}`);
    });
  }
  console.log("=====================================\n");

  res.json({ ok: true, pesan: "Data + foto diterima" });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server ON di port ${PORT}`);
});
