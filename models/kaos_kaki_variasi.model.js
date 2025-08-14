import mongoose from 'mongoose';

const KaosKakiVariasiSchema = new mongoose.Schema({
  kaos_kaki_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KaosKaki',
    required: true,
    index: true,
  },
  ukuran_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ukuran',
    required: true,
    index: true,
  },
  warna_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warna',
    required: true,
    index: true,
  },
  stok: {
    type: Number,
    default: 0,
  },
});

const KaosKakiVariasi = mongoose.model('KaosKakiVariasi', KaosKakiVariasiSchema);

export default KaosKakiVariasi;
