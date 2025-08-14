import mongoose from 'mongoose';

const PhotoKaosKakiSchema = new mongoose.Schema({
  kaos_kaki_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KaosKaki',
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const PhotoKaosKaki = mongoose.model('PhotoKaosKaki', PhotoKaosKakiSchema);

export default PhotoKaosKaki;
