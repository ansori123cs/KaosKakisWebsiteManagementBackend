import mongoose from 'mongoose';

const WarnaSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
});
const Warna = mongoose.model('Warna', WarnaSchema);

export default Warna;
