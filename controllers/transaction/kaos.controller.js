import sequelize from '../../config/databaseConfig.js';
import { Op } from 'sequelize';
import fs from 'fs';
import models from '../../models/init-models.js';
const { data_mesin, jenis_bahan, jenis_mesin, foto_kaos_kaki, kaos_kaki } = models(sequelize);

// READ ALL dengan Pagination

export const getAllKaosKaki = async (req, res, next) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Dapatkan data dengan pagination
    const { count, rows: kaosKakiList } = await kaos_kaki.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: jenis_bahan,
          as: 'jenis_bahan',
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    // Jika tidak ada data
    if (kaosKakiList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Data kaos kaki kosong',
        data: {
          kaosKakiList: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
          },
        },
      });
    }

    // Proses data untuk menambahkan gambar dan mesin
    const kaosKakiListWithImages = await Promise.all(
      kaosKakiList.map(async (item) => {
        // Mengambil gambar kaos kaki
        const images = await foto_kaos_kaki.findAll({
          where: { kaos_kaki_id: item.id },
        });

        // Mengambil data mesin
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
              return mesin.jenis_mesin ? mesin.jenis_mesin.nama : null;
            })
            .filter((nama) => nama !== null), // Filter null values
        };
      })
    );

    // Response sukses
    res.status(200).json({
      success: true,
      message: 'List Kaos Kaki berhasil diambil',
      data: {
        kaosKakiList: kaosKakiListWithImages,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    // Error handling yang lebih spesifik
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengambil data kaos kaki';
    }
    next(error);
  }
};

//==============================================================================================

// READ ONE Kaos Kaki

export const getKaosKakiById = async (req, res, next) => {
  try {
    // Mendapatkan ID dari parameter URL (bukan hard-coded)
    const kaosKakiId = req.params.id; // ID diambil dari route parameter seperti /api/kaos-kaki/:id

    // Mencari kaos kaki berdasarkan primary key dengan include relasi
    const kaosKaki = await kaos_kaki.findByPk(kaosKakiId, {
      include: [
        {
          model: jenis_bahan,
          as: 'jenis_bahan', // Menggunakan alias yang sesuai dengan relasi
        },
      ],
    });

    // Jika kaos kaki tidak ditemukan
    if (!kaosKaki) {
      const error = new Error('Kaos kaki tidak ditemukan');
      error.statusCode = 404;
      throw error; // Melempar error untuk ditangkap oleh catch block
    }

    // Mengambil gambar kaos kaki
    const images = await foto_kaos_kaki.findAll({
      where: { kaos_kaki_id: kaosKaki.id },
    });

    // Mengambil data mesin yang terkait
    const mesinKaosKaki = await data_mesin.findAll({
      where: { kaos_kaki_id: kaosKaki.id },
      include: [
        {
          model: jenis_mesin,
          as: 'jenis_mesin', // Menggunakan alias yang sesuai dengan relasi
        },
      ],
    });

    // Membuat response object dengan data yang lengkap
    const kaosKakiWithMachineAndImages = {
      ...kaosKaki.toJSON(), // Mengconvert instance Sequelize ke object JSON biasa
      images: images.map((img) => img.url), // Extract URL gambar
      mesin: mesinKaosKaki
        .map((mesin) => {
          // Akses nama mesin melalui relasi
          return mesin.jenis_mesin ? mesin.jenis_mesin.nama : null;
        })
        .filter((nama) => nama !== null), // Filter null values
    };

    // Response sukses
    res.status(200).json({
      success: true,
      message: 'Kaos Kaki berhasil diambil',
      data: {
        kaosKaki: kaosKakiWithMachineAndImages, // Mengirim data yang sudah diproses
      },
    });
  } catch (error) {
    // Error handling yang lebih spesifik
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengambil data kaos kaki: ' + error.message;
    }
    next(error); // Meneruskan error ke middleware error handling
  }
};
//==============================================================================================

// READ Search by name and pagination dan filter tambahan

export const getKaosKakiByName = async (req, res, next) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchedNameKaosKaki = req.query.nama_kaos || '';
    const jenisBahanId = req.query.jenis_bahan || null;
    const jenisMesinId = req.query.jenis_mesin || null;
    const offset = (page - 1) * limit;

    // Membuat kondisi pencarian utama dengan operator LIKE untuk pencarian parsial
    const whereCondition = {};

    // Filter berdasarkan nama kaos kaki (jika ada)
    if (searchedNameKaosKaki) {
      whereCondition.nama = {
        [Op.like]: `%${searchedNameKaosKaki}%`, // Mencari nama yang mengandung string yang dicari
      };
    }

    // Filter berdasarkan jenis bahan (jika ada)
    if (jenisBahanId) {
      whereCondition.jenis_bahan_id = jenisBahanId; // Filter by jenis_bahan_id
    }

    // Persiapan filter untuk mesin (akan digunakan dalam subquery)
    let mesinFilterCondition = {};
    if (jenisMesinId) {
      mesinFilterCondition.jenis_mesin_id = jenisMesinId; // Filter by jenis_mesin_id
    }

    // Dapatkan data dengan pagination dan filtering
    const { count, rows: kaosKakiList } = await kaos_kaki.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: jenis_bahan,
          as: 'jenis_bahan',
          attributes: ['id', 'nama', 'kode_bahan'],
        },
      ],
      where: whereCondition,
    });

    const totalPages = Math.ceil(count / limit);

    if (kaosKakiList.length === 0) {
      return res.status(200).json({
        success: true,
        message: searchedNameKaosKaki ? `Tidak ditemukan kaos kaki dengan nama '${searchedNameKaosKaki}'` : 'Data kaos kaki kosong',
        data: {
          kaosKakiList: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
          },
        },
      });
    }

    const kaosKakiListWithImages = await Promise.all(
      kaosKakiList.map(async (item) => {
        // Mengambil gambar kaos kaki
        const images = await foto_kaos_kaki.findAll({
          where: { kaos_kaki_id: item.id },
          attributes: ['id', 'url', 'createdAt'], // Hanya ambil field yang diperlukan
        });

        // Mengambil data mesin dengan filter jenis mesin (jika ada)
        const mesinKaosKaki = await data_mesin.findAll({
          where: {
            kaos_kaki_id: item.id,
            ...mesinFilterCondition, // Terapkan filter jenis mesin jika ada
          },
          include: [
            {
              model: jenis_mesin,
              as: 'jenis_mesin',
              attributes: ['id', 'nama', 'kode_mesin'], // Hanya ambil field yang diperlukan
            },
          ],
          attributes: ['id', 'jenis_mesin_id', 'createdAt'], // Hanya ambil field yang diperlukan
        });

        return {
          ...item.toJSON(), // Mengconvert instance Sequelize ke object JSON biasa
          images: images.map((img) => img.url), // Extract URL gambar
          mesin: mesinKaosKaki
            .map((mesin) => {
              // Akses detail mesin melalui relasi
              return mesin.jenis_mesin
                ? {
                    id: mesin.jenis_mesin.id,
                    nama: mesin.jenis_mesin.nama,
                    keterangan: mesin.jenis_mesin.keterangan,
                  }
                : null;
            })
            .filter((mesin) => mesin !== null), // Filter null values
        };
      })
    );

    // Filter tambahan: jika ada filter jenis mesin, hapus item yang tidak memiliki mesin sesuai filter
    const filteredKaosKakiList = jenisMesinId ? kaosKakiListWithImages.filter((item) => item.mesin.length > 0) : kaosKakiListWithImages;

    // Hitung ulang total items setelah filter mesin
    const filteredTotalItems = jenisMesinId ? filteredKaosKakiList.length : count;

    // Response sukses
    res.status(200).json({
      success: true,
      message: searchedNameKaosKaki ? `Pencarian kaos kaki dengan nama '${searchedNameKaosKaki}' berhasil` : 'List Kaos Kaki berhasil diambil',
      data: {
        kaosKakiList: filteredKaosKakiList,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: filteredTotalItems, // Gunakan count yang sudah difilter
          totalPages: Math.ceil(filteredTotalItems / limit), // Hitung ulang total pages
          hasNextPage: page < Math.ceil(filteredTotalItems / limit), // Apakah ada halaman berikutnya
          hasPreviousPage: page > 1, // Apakah ada halaman sebelumnya
        },
        filters: {
          // Tambahkan info filter yang digunakan
          nama: searchedNameKaosKaki || 'Semua',
          jenis_bahan_id: jenisBahanId || 'Semua',
          jenis_mesin_id: jenisMesinId || 'Semua',
        },
      },
    });
  } catch (error) {
    // Error handling yang lebih spesifik
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengambil data kaos kaki: ' + error.message;
    }
    next(error); // Meneruskan error ke middleware error handling
  }
};

//==============================================================================================

//utility photo dan machines

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

const createDataMesin = async (kodeMesin, kaosKakiId, transaction) => {
  return await data_mesin.create(
    {
      kaos_kaki_id: kaosKakiId,
      jenis_mesin_id: kodeMesin,
    },
    { transaction }
  );
};

//==============================================================================================

//CREATE Kaos Kaki
export const createKaosKaki = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { nama_kaos, jenis_bahan_id: jenis_bahan, keterangan, tgl_terakhir_pesan, kode_kaos_kaki, kode_mesin } = req.body;

    console.log(JSON.stringify(req.body, null, ' '));

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

    const newKaosKaki = await kaos_kaki.create(
      {
        nama: nama_kaos.trim(),
        jenis_bahan_id: jenis_bahan,
        keterangan: keterangan?.trim(),
        last_order_date: tgl_terakhir_pesan,
        kode_kaos_kaki: kode_kaos_kaki.trim(),
        status: 1,
      },
      { transaction }
    );

    // Upload foto kalau ada
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

    // buat data mesin
    let savedDataMesin = [];
    if (kode_mesin?.length > 0) {
      const mesinPromises = kode_mesin.map((kode, index) => createDataMesin(kode, newKaosKaki.id, transaction));
      savedDataMesin = await Promise.all(mesinPromises);
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
        machines: savedDataMesin.map((mesin) => ({
          kode: mesin.jenis_mesin_id,
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

//==============================================================================================

// UPDATE Kaos Kaki

export const updateKaosKaki = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { id } = req.params; // ID kaos kaki yang akan diupdate
    const { nama_kaos, jenis_bahan_id: jenis_bahan, keterangan, tgl_terakhir_pesan, kode_kaos_kaki, kode_mesin } = req.body;

    console.log('Update Data:', JSON.stringify(req.body, null, ' '));

    // ✅ Cari kaos kaki yang akan diupdate
    const existingKaosKaki = await kaos_kaki.findByPk(id, { transaction });

    if (!existingKaosKaki) {
      return res.status(404).json({
        success: false,
        message: 'Kaos kaki tidak ditemukan',
      });
    }

    // ✅ Cek duplikasi kode (kecuali untuk data yang sedang diupdate)
    if (kode_kaos_kaki && kode_kaos_kaki !== existingKaosKaki.kode_kaos_kaki) {
      const duplicateKaosKaki = await kaos_kaki.findOne({
        where: {
          kode_kaos_kaki: kode_kaos_kaki.trim(),
          id: { [Op.ne]: id }, // Tidak termasuk data yang sedang diupdate
        },
        transaction,
      });

      if (duplicateKaosKaki) {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          message: 'Kode kaos kaki sudah digunakan oleh data lain',
        });
      }
    }

    // ✅ Prepare data untuk update (hanya field yang ada di request)
    const updateData = {};
    if (nama_kaos !== undefined) updateData.nama = nama_kaos.trim();
    if (jenis_bahan !== undefined) updateData.jenis_bahan_id = jenis_bahan;
    if (keterangan !== undefined) updateData.keterangan = keterangan?.trim();
    if (tgl_terakhir_pesan !== undefined) updateData.last_order_date = tgl_terakhir_pesan;
    if (kode_kaos_kaki !== undefined) updateData.kode_kaos_kaki = kode_kaos_kaki.trim();

    // ✅ Update data kaos kaki jika ada perubahan
    if (Object.keys(updateData).length > 0) {
      await existingKaosKaki.update(updateData, { transaction });
    }

    // ✅ Handle foto: hanya update jika ada file baru yang diupload
    let savedPhotos = [];
    if (req.files && req.files.length > 0) {
      // Optional: jika ingin menghapus foto lama saat upload baru
      // await foto_kaos_kaki.destroy({ where: { kaos_kaki_id: id }, transaction });

      // Upload foto baru (tambah tanpa hapus yang lama)
      const photoPromises = req.files.map((file, index) =>
        createPhotoKaosKaki(
          `/uploads/kaoskakisimages/${file.filename}`,
          id,
          index === 0, // pertama = primary
          transaction
        )
      );
      savedPhotos = await Promise.all(photoPromises);
    }

    // ✅ Handle mesin: hanya update jika kode_mesin ada di request
    let savedDataMesin = [];
    if (kode_mesin !== undefined) {
      // Hapus semua data mesin lama jika ingin replace
      await data_mesin.destroy({
        where: { kaos_kaki_id: id },
        transaction,
      });

      // Buat data mesin baru
      if (kode_mesin.length > 0) {
        const mesinPromises = kode_mesin.map((kode) => createDataMesin(kode, id, transaction));
        savedDataMesin = await Promise.all(mesinPromises);
      }
    }

    await transaction.commit();

    // ✅ Dapatkan data terbaru untuk response
    const updatedKaosKaki = await kaos_kaki.findByPk(id, {
      include: [
        {
          model: jenis_bahan,
          as: 'jenis_bahan',
        },
      ],
    });

    const photos = await foto_kaos_kaki.findAll({
      where: { kaos_kaki_id: id },
    });

    const machines = await data_mesin.findAll({
      where: { kaos_kaki_id: id },
      include: [
        {
          model: jenis_mesin,
          as: 'jenis_mesin',
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Kaos kaki berhasil diupdate',
      data: {
        kaosKaki: {
          id: updatedKaosKaki.id,
          nama: updatedKaosKaki.nama,
          kode: updatedKaosKaki.kode_kaos_kaki,
          jenis_bahan_id: updatedKaosKaki.jenis_bahan_id,
          jenis_bahan: updatedKaosKaki.jenis_bahan,
          keterangan: updatedKaosKaki.keterangan,
          last_order_date: updatedKaosKaki.last_order_date,
          status: updatedKaosKaki.status,
        },
        photos: photos.map((photo) => ({
          id: photo.id,
          url: photo.url,
          is_primary: photo.is_primary,
        })),
        machines: machines.map((machine) => ({
          id: machine.id,
          jenis_mesin_id: machine.jenis_mesin_id,
          jenis_mesin: machine.jenis_mesin,
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

    console.error(`[UPDATE_KAOS_KAKI_ERROR] ${error}`);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Data validation error',
        errors: error.errors.map((err) => err.message),
      });
    }

    next(error);
  }
};

//==============================================================================================

// DELETE Kaos Kaki

export const deleteKaosKaki = async (req, res, next) => {
  let transaction;
  try {
    // Memulai transaction untuk memastikan konsistensi data
    transaction = await sequelize.transaction();

    const { id } = req.params; // Mendapatkan ID kaos kaki dari parameter URL

    // ✅ Pertama: Cari kaos kaki untuk memastikan existensi
    const kaosKaki = await kaos_kaki.findByPk(id, { transaction });

    if (!kaosKaki) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Kaos kaki tidak ditemukan',
      });
    }

    // ✅ Kedua: Hapus semua foto terkait kaos kaki
    await foto_kaos_kaki.destroy({
      where: { kaos_kaki_id: id },
      transaction,
    });

    // ✅ Ketiga: Hapus semua data mesin terkait kaos kaki
    await data_mesin.destroy({
      where: { kaos_kaki_id: id },
      transaction,
    });

    // ✅ Keempat: Hapus data kaos kaki itu sendiri
    const deletedKaosKaki = await kaos_kaki.destroy({
      where: { id },
      transaction,
    });

    // Commit transaction jika semua operasi berhasil
    await transaction.commit();

    // ✅ Hapus file foto dari storage (jika diperlukan)
    // Note: Ini opsional, tergantung kebutuhan aplikasi
    // const photos = await foto_kaos_kaki.findAll({
    //   where: { kaos_kaki_id: id },
    //   paranoid: false // Jika menggunakan soft delete
    // });
    // photos.forEach(photo => {
    //   const filename = photo.url.split('/').pop();
    //   fs.unlink(`./uploads/kaoskakisimages/${filename}`, (err) => {
    //     if (err) console.error('Gagal hapus file:', err);
    //   });
    // });

    res.status(200).json({
      success: true,
      message: 'Kaos kaki berhasil dihapus',
      data: {
        deletedId: id,
        deletedKaosKaki: {
          id: kaosKaki.id,
          nama: kaosKaki.nama,
          kode: kaosKaki.kode_kaos_kaki,
        },
      },
    });
  } catch (error) {
    // Rollback transaction jika terjadi error
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    console.error(`[DELETE_KAOS_KAKI_ERROR] ${error.message}`);

    // Error handling spesifik
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus kaos kaki karena masih terkait dengan data lain',
      });
    }

    next(error);
  }
};

//==============================================================================================
