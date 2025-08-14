import mongoose from 'mongoose';

const DataMesinSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true,
  },
});

const DataMesin = mongoose.model('DataMesin', DataMesinSchema);

export default DataMesin;
