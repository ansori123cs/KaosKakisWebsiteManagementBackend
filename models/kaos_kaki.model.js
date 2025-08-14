import mongoose from 'mongoose';

const kaosKakiSchema = new mongoose.Schema(
  {
    namaKaosKaki: {
      type: String,
      required: [true, 'nama sekolah Required'],
      trim: true,
      minLength: 2,
      maxLength: 255,
    },
    jenis_bahan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JenisBahan',
      required: [true, 'must have jenis bahan'],
      required: true,
      index: true,
    },
    data_mesin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataMesin',
      required: [true, 'must have data mesin'],
      required: true,
      index: true,
    },
    keterangan: {
      type: String,
    },
    stok: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    last_order_date: {
      type: Date,
    },
    userEdited: {
      type: String,
      required: [true, 'must a user inserted'],
    },
  },
  { timestamps: true }
);

const KaosKaki = mongoose.model('KaosKaki', kaosKakiSchema);

export default KaosKaki;
