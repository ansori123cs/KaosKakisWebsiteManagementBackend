import DataMesin from '../../models/data_mesin.model.js';
import JenisBahan from '../../models/jenis_bahan.model.js';
import KaosKaki from '../../models/kaos_kaki.model.js';
import PhotoKaosKaki from '../../models/photo_kaos_kaki.model.js';

// CREATE PHOTO HELPER
const createPhotoKaosKaki = async (imagePath, kaosKakiId) => {
  return await PhotoKaosKaki.create({
    url: imagePath, // path lokal
    kaos_kaki_id: kaosKakiId,
  });
};

// CREATE KAOS KAKI
export const createKaosKaki = async (req, res, next) => {
  try {
    const newKaosKaki = await KaosKaki.create({
      ...req.body,
      userEdited: req.user?.username || 'admin',
    });

    // Ambil path gambar dari file upload
    const photoPromises = req.files.map((file) => createPhotoKaosKaki(`/uploads/kaoskakisimages/${file.filename}`, newKaosKaki._id));
    const savedPhotos = await Promise.all(photoPromises);

    res.status(201).json({
      success: true,
      data: newKaosKaki,
      photos: savedPhotos,
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL
export const getAllKaosKaki = async (req, res, next) => {
  try {
    const kaosKakiList = await KaosKaki.find().populate('jenis_bahan_id').populate('data_mesin_id');

    if (!kaosKakiList) {
      return res.status(404).json({ success: false, message: 'Kaos kaki tidak ditemukan' });
    }

    const kaosKakiListWithImages = await Promise.all(
      kaosKakiList.map(async (item) => {
        const images = await PhotoKaosKaki.find({ kaos_kaki_id: item._id });
        return {
          ...item.toObject(),
          images: images.map((img) => img.url),
        };
      })
    );

    res.status(200).json({ success: true, data: kaosKakiListWithImages });
  } catch (error) {
    next(error);
  }
};

// READ ONE
export const getKaosKakiById = async (req, res, next) => {
  try {
    const kaosKaki = await KaosKaki.findById(req.params.id).populate('jenis_bahan_id').populate('data_mesin_id');

    if (!kaosKaki) {
      return res.status(404).json({ success: false, message: 'Kaos kaki tidak ditemukan' });
    }

    const images = await PhotoKaosKaki.find({ kaos_kaki_id: kaosKaki._id });

    const kaosWithImages = {
      ...kaosKaki.toObject(),
      images: images.map((img) => img.url),
    };

    res.status(200).json({ success: true, data: kaosWithImages });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateKaosKaki = async (req, res, next) => {
  try {
    const updatedKaosKaki = await KaosKaki.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updated_at: new Date(),
        userEdited: req.user?.username || 'admin',
      },
      { new: true }
    );
    if (!updatedKaosKaki) {
      return res.status(404).json({ success: false, message: 'Kaos kaki tidak ditemukan' });
    }
    res.json({ success: true, data: updatedKaosKaki });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteKaosKaki = async (req, res, next) => {
  try {
    const deletedKaosKaki = await KaosKaki.findByIdAndDelete(req.params.id);
    if (!deletedKaosKaki) {
      return res.status(404).json({ success: false, message: 'Kaos kaki tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Kaos kaki berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

// CREATE BAHAN
export const createJenisBahan = async (req, res, next) => {
  try {
    const newJenisBahan = await JenisBahan.create({
      ...req.body,
    });
    res.status(201).json({ success: true, data: newJenisBahan });
  } catch (error) {
    next(error);
  }
};
// CREATE MESIN
export const createDataMesin = async (req, res, next) => {
  try {
    const newDataMesin = await DataMesin.create({
      ...req.body,
    });
    res.status(201).json({ success: true, data: newDataMesin });
  } catch (error) {
    next(error);
  }
};
