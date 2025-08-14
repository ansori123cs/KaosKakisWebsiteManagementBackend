import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Validasi req.nameFolder
    console.log(req.nameFolder);
    if (!req.nameFolder) {
      return cb(new Error('Nama folder tidak tersedia'), null);
    }

    // Path folder berdasarkan req.nameFolder
    const uploadDir = path.join('uploads', req.nameFolder);

    // Cek apakah folder sudah ada
    fs.access(uploadDir, fs.constants.F_OK, (err) => {
      if (err) {
        // Jika folder belum ada, buat baru
        fs.mkdir(uploadDir, { recursive: true }, (err) => {
          if (err) return cb(err, null);
          cb(null, uploadDir);
        });
      } else {
        // Jika folder sudah ada, langsung gunakan
        cb(null, uploadDir);
      }
    });
  },
  filename: (req, file, cb) => {
    // Nama file unik: timestamp + nameFolder asli file
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(ext);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Hanya file gambar (jpeg, jpg, png, webp) yang diperbolehkan'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB
  },
});

export default upload;
