import sequelize from '../../config/databaseConfig.js';

import models from '../../models/init-models.js';
const { ukuran } = models(sequelize);

//get all jenis ukuran
export const getAllJenisUkuran = async (req, res, next) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Dapatkan data dengan pagination
    const { count, rows: jenisUkuranList } = await ukuran.findAndCountAll({
      limit,
      offset,
      // order: [['createdAt', 'DESC']], // Urutkan berdasarkan yang terbaru
    });

    // Hitung total pages
    const totalPages = Math.ceil(count / limit);

    // Jika tidak ada data
    if (jenisUkuranList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Data jenis Ukuran kosong',
        data: {
          jenisUkuranList: [],
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
          },
        },
      });
    }

    // Response sukses
    res.status(200).json({
      success: true,
      message: 'List Jenis Ukuran berhasil diambil',
      data: {
        jenisUkuranList,
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
      error.message = 'Gagal mengambil data jenis ukuran';
    }
    next(error);
  }
};

//create new jenis ukuran
export const createNewJenisUkuran = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!nama_jenis || !kode_jenis) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek ukuran sudah ada atau belum
    const existingJenisUkuran = await ukuran.findAll({
      where: { nama: nama_jenis },
      transaction: t,
    });

    if (existingJenisUkuran.length !== 0) {
      const error = new Error('Jenis Ukuran Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisUkuran = await ukuran.create(
      {
        nama: nama_jenis,
        kode_ukuran: kode_jenis,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Sukses Jenis Ukuran Baru Dibuat',
      data: {
        kode_jenis: kode_jenis,
        nama_jenis: nama_jenis,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal create jenis Ukuran';
    }
    next(error);
  }
};

//update jenis ukuran
export const updateJenisUkuran = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params; // Menggunakan ID sebagai parameter
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis ukuran harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    if (!nama_jenis?.trim() || !kode_jenis?.trim()) {
      const error = new Error('Nama dan kode ukuran harus diisi');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingUkuran = await ukuran.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingUkuran) {
      const error = new Error('Jenis ukuran tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Cek duplikasi kode ukuran (kecuali untuk record ini)
    const duplicateKode = await ukuran.findOne({
      where: {
        kode_ukuran: kode_jenis,
        id: { [Op.ne]: id }, // Tidak termasuk record saat ini
      },
      transaction: t,
    });

    if (duplicateKode) {
      const error = new Error('Kode ukuran sudah digunakan oleh jenis ukuran lain');
      error.statusCode = 409;
      throw error;
    }

    // Cek duplikasi nama (kecuali untuk record ini)
    const duplicateNama = await ukuran.findOne({
      where: {
        nama: nama_jenis,
        id: { [Op.ne]: id },
      },
      transaction: t,
    });

    if (duplicateNama) {
      const error = new Error('Nama ukuran sudah digunakan oleh jenis ukuran lain');
      error.statusCode = 409;
      throw error;
    }

    // Update data
    const [affectedRows] = await ukuran.update(
      {
        nama: nama_jenis.trim(),
        kode_ukuran: kode_jenis.trim(),
        // updated_at: new Date()
      },
      {
        where: { id },
        transaction: t,
      }
    );

    if (affectedRows === 0) {
      const error = new Error('Tidak ada data yang diupdate');
      error.statusCode = 404;
      throw error;
    }

    // Dapatkan data terbaru
    const updatedUkuran = await ukuran.findOne({
      where: { id },
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Jenis ukuran berhasil diupdate',
      data: updatedUkuran,
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengupdate jenis ukuran';
    }
    next(error);
  }
};

//delete Jenis ukuran
export const deleteJenisUkuran = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis ukuran harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingUkuran = await ukuran.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingUkuran) {
      const error = new Error('Jenis ukuran tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Hapus data
    const [affectedRows] = await ukuran.destroy({
      where: { id },
      transaction: t,
    });

    if (affectedRows === 0) {
      const error = new Error('Tidak ada data yang dihapus');
      error.statusCode = 404;
      throw error;
    }

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Jenis ukuran berhasil dihapus',
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal menghapus jenis ukuran';
    }
    next(error);
  }
};
