import sequelize from '../../config/databaseConfig.js';

import fs from 'fs';
import path from 'path';

import models from '../../models/init-models.js';
const { data_mesin, jenis_bahan, jenis_mesin, foto_kaos_kaki, kaos_kaki } = models(sequelize);

const createPhotoKaosKaki = async (imagePath, kaosKakiId, isPrimary, transaction) => {
  return await foto_kaos_kaki.create(
    {
      kaos_kaki_id: kaosKakiId,
      url: imagePath,
      is_primary: isPrimary,
    },
    { transaction }
  );
};

// Controller: create Kaos Kaki
export const createKaosKaki = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { nama_kaos, jenis_bahan_id: jenis_bahan, keterangan, tgl_terakhir_pesan, kode_kaos_kaki } = req.body;

    // ✅ Validasi input
    if (!nama_kaos?.trim() || !jenis_bahan || !kode_kaos_kaki?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama, jenis bahan, dan kode kaos kaki harus diisi',
      });
    }

    // ✅ Cek duplikasi kode
    const existingKaosKaki = await kaos_kaki.findOne({
      where: { kode_kaos_kaki },
      transaction,
    });

    if (existingKaosKaki) {
      return res.status(409).json({
        success: false,
        message: 'Kode kaos kaki sudah digunakan',
      });
    }

    // ✅ Buat entitas kaos_kaki
    const newKaosKaki = await kaos_kaki.create(
      {
        nama: nama_kaos.trim(),
        jenis_bahan_id: jenis_bahan,
        keterangan: keterangan?.trim(),
        last_order_date: tgl_terakhir_pesan,
        kode_kaos_kaki: kode_kaos_kaki.trim(),
      },
      { transaction }
    );

    // ✅ Upload foto kalau ada
    let savedPhotos = [];
    if (req.files?.length > 0) {
      const photoPromises = req.files.map((file, index) =>
        createPhotoKaosKaki(
          `/uploads/kaoskakisimages/${file.filename}`,
          newKaosKaki.id,
          index === 0, // pertama = primary
          transaction
        )
      );
      savedPhotos = await Promise.all(photoPromises);
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Kaos kaki berhasil dibuat',
      data: {
        kaosKaki: {
          id: newKaosKaki.id,
          nama: newKaosKaki.nama,
          kode: newKaosKaki.kode_kaos_kaki,
          jenis_bahan_id: newKaosKaki.jenis_bahan_id,
        },
        photos: savedPhotos.map((photo) => ({
          id: photo.id,
          url: photo.url,
          is_primary: photo.is_primary,
        })),
      },
    });
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();

    // ✅ Hapus file jika gagal
    if (req.files?.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(`./uploads/kaoskakisimages/${file.filename}`, (err) => {
          if (err) console.error(`Gagal hapus file: ${file.filename}`, err);
        });
      });
    }
    if (error.message === 'Validation error') {
      return res.status(409).json({
        success: false,
        message: 'Kaos Kaki Sudah Ada',
      });
    }
    console.error(`[CREATE_KAOS_KAKI_ERROR] ${error}`);
    next(error);
  }
};

// READ ALL
export const getAllKaosKaki = async (req, res, next) => {
  try {
    const kaosKakiList = await kaos_kaki.findAll({
      include: [
        {
          model: jenis_bahan,
          as: 'jenis_bahan',
        },
      ],
    });

    if (!kaosKakiList || kaosKakiList.length === 0) {
      return res.status(404).json({ success: false, message: 'Kaos kaki tidak ditemukan' });
    }

    const kaosKakiListWithImages = await Promise.all(
      kaosKakiList.map(async (item) => {
        // Mengambil gambar kaos kaki
        const images = await foto_kaos_kaki.findAll({
          where: { kaos_kaki_id: item.id },
        });

        // Mengambil data mesin dengan include yang benar
        const mesinKaosKaki = await data_mesin.findAll({
          where: { kaos_kaki_id: item.id },
          include: [
            {
              model: jenis_mesin,
              as: 'jenis_mesin',
            },
          ],
        });

        return {
          ...item.toJSON(),
          images: images.map((img) => img.url),
          mesin: mesinKaosKaki
            .map((mesin) => {
              // Akses nama mesin melalui relasi
              return mesin.namaMesin ? mesin.namaMesin.nama : null;
            })
            .filter((nama) => nama !== null), // Filter null values
        };
      })
    );

    console.log(JSON.stringify(kaosKakiListWithImages, null, ' '));
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
