import mongoose from 'mongoose';

const UkuranSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
});

const Ukuran = mongoose.model('Ukuran', UkuranSchema);

export default Ukuran;
