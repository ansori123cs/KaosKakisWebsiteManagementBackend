import mongoose from 'mongoose';

const PesananSchema = new mongoose.Schema({
  nama_pemesan: {
    type: String,
    required: true,
  },
  catatan: {
    type: String,
  },
  tanggal: {
    type: Date,
    default: Date.now,
  },
  id_kaos_kaki: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KaosKaki',
    required: true,
    index: true,
  },
});

const Pesanan = mongoose.model('Pesanan', PesananSchema);

export default Pesanan;
