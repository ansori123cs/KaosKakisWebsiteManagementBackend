import mongoose from 'mongoose';

const PesananDetailSchema = new mongoose.Schema({
  pesanan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pesanan',
    required: true,
    index: true,
  },
  kaos_kaki_variasi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KaosKakiVariasi',
    required: true,
    index: true,
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1,
  },
});
const PesananDetail = mongoose.model('PesananDetail', PesananDetailSchema);

export default PesananDetail;
