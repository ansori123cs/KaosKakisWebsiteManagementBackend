import sequelize from '../../config/databaseConfig.js';

import models from '../../models/init-models.js';
const { warna } = models(sequelize);

//get all jenis warna
export const getAllJenisWarna = async (req, res, next) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Dapatkan data dengan pagination
    const { count, rows: jenisWarnaList } = await warna.findAndCountAll({
      limit,
      offset,
      // order: [['createdAt', 'DESC']], // Urutkan berdasarkan yang terbaru
    });

    // Hitung total pages
    const totalPages = Math.ceil(count / limit);

    // Jika tidak ada data
    if (jenisWarnaList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Data jenis Warna kosong',
        data: {
          jenisWarnaList: [],
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
      message: 'List Jenis Warna berhasil diambil',
      data: {
        jenisWarnaList,
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
      error.message = 'Gagal mengambil data jenis warna';
    }
    next(error);
  }
};

//create new jenis warna
export const createNewJenisWarna = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!nama_jenis || !kode_jenis) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek warna sudah ada atau belum
    const existingJenisWarna = await warna.findAll({
      where: { nama: nama_jenis },
      transaction: t,
    });

    if (existingJenisWarna.length !== 0) {
      const error = new Error('Jenis warna Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisWarna = await warna.create(
      {
        nama: nama_jenis,
        kode_warna: kode_jenis,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Sukses Jenis Warna Baru Dibuat',
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
      error.message = 'Gagal create jenis Warna';
    }
    next(error);
  }
};

//update jenis warna
export const updateJenisWarna = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params; // Menggunakan ID sebagai parameter
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis warna harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    if (!nama_jenis?.trim() || !kode_jenis?.trim()) {
      const error = new Error('Nama dan kode warna harus diisi');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingWarna = await warna.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingWarna) {
      const error = new Error('Jenis warna tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Cek duplikasi kode warna (kecuali untuk record ini)
    const duplicateKode = await warna.findOne({
      where: {
        kode_warna: kode_jenis,
        id: { [Op.ne]: id }, // Tidak termasuk record saat ini
      },
      transaction: t,
    });

    if (duplicateKode) {
      const error = new Error('Kode warna sudah digunakan oleh jenis warna lain');
      error.statusCode = 409;
      throw error;
    }

    // Cek duplikasi nama (kecuali untuk record ini)
    const duplicateNama = await warna.findOne({
      where: {
        nama: nama_jenis,
        id: { [Op.ne]: id },
      },
      transaction: t,
    });

    if (duplicateNama) {
      const error = new Error('Nama warna sudah digunakan oleh jenis warna lain');
      error.statusCode = 409;
      throw error;
    }

    // Update data
    const [affectedRows] = await warna.update(
      {
        nama: nama_jenis.trim(),
        kode_warna: kode_jenis.trim(),
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
    const updatedWarna = await warna.findOne({
      where: { id },
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Jenis warna berhasil diupdate',
      data: updatedWarna,
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengupdate jenis warna';
    }
    next(error);
  }
};

//delete Jenis warna
export const deleteJenisWarna = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis warna harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingWarna = await warna.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingWarna) {
      const error = new Error('Jenis warna tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Hapus data
    const [affectedRows] = await warna.destroy({
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
      message: 'Jenis warna berhasil dihapus',
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal menghapus jenis warna';
    }
    next(error);
  }
};
