import mongoose from 'mongoose';

const JenisBahanSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
});
const JenisBahan = mongoose.model('JenisBahan', JenisBahanSchema);

export default JenisBahan;
