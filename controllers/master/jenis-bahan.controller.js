import { Op } from 'sequelize';
import sequelize from '../../config/databaseConfig.js';
import models from '../../models/init-models.js';
const { jenis_bahan } = models(sequelize);

//get all jenis bahan
export const getAllJenisBahan = async (req, res, next) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Dapatkan data dengan pagination
    const { count, rows: jenisBahanList } = await jenis_bahan.findAndCountAll({
      limit,
      offset,
      // order: [['createdAt', 'DESC']], // Urutkan berdasarkan yang terbaru
    });

    // Hitung total pages
    const totalPages = Math.ceil(count / limit);

    // Jika tidak ada data
    if (jenisBahanList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Data jenis bahan kosong',
        data: {
          jenisBahanList: [],
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
      message: 'List Jenis Bahan berhasil diambil',
      data: {
        jenisBahanList,
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
      error.message = 'Gagal mengambil data jenis bahan';
    }
    next(error);
  }
};

//create new jenis bahan
export const createNewJenisBahan = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!nama_jenis || !kode_jenis) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek bahan sudah ada atau belum
    const existingJenisBahan = await jenis_bahan.findAll({
      where: { nama: nama_jenis },
      transaction: t,
    });

    if (existingJenisBahan.length !== 0) {
      const error = new Error('Jenis Bahan Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisBahan = await jenis_bahan.create(
      {
        nama: nama_jenis,
        kode_bahan: kode_jenis,
        status: 1,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Sukses Jenis Bahan Baru Dibuat',
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
      error.message = 'Gagal create jenis bahan';
    }
    next(error);
  }
};

//update jenis bahan
export const updateJenisBahan = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params; // Menggunakan ID sebagai parameter
    const { nama_jenis, kode_jenis, status_jenis } = req.body;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis Bahan harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    if (!nama_jenis?.trim() || !kode_jenis?.trim()) {
      const error = new Error('Nama dan kode bahan harus diisi');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingBahan = await jenis_bahan.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingBahan) {
      const error = new Error('Jenis bahan tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Cek duplikasi kode bahan (kecuali untuk record ini)
    const duplicateKode = await jenis_bahan.findOne({
      where: {
        kode_bahan: kode_jenis,
        id: { [Op.ne]: id },
      },
      transaction: t,
    });

    if (duplicateKode) {
      const error = new Error('Kode bahan sudah digunakan oleh jenis bahan lain');
      error.statusCode = 409;
      throw error;
    }

    // Cek duplikasi nama (kecuali untuk record ini)
    const duplicateNama = await jenis_bahan.findOne({
      where: {
        nama: nama_jenis,
        id: { [Op.ne]: id },
      },
      transaction: t,
    });

    if (duplicateNama) {
      const error = new Error('Nama bahan sudah digunakan oleh jenis bahan lain');
      error.statusCode = 409;
      throw error;
    }

    // Update data
    const [affectedRows] = await jenis_bahan.update(
      {
        nama: nama_jenis.trim(),
        kode_bahan: kode_jenis.trim(),
        status: status_jenis,
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
    const updatedBahan = await jenis_bahan.findOne({
      where: { id },
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Jenis bahan berhasil diupdate',
      data: updatedBahan,
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengupdate jenis bahan';
    }
    next(error);
  }
};

//delete Jenis Bahan
export const deleteJenisBahan = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis Bahan harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingBahan = await jenis_bahan.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingBahan) {
      const error = new Error('Jenis bahan tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Update status data menjadi 0 keperluan audit
    const [affectedRows] = await jenis_bahan.update(
      {
        status: 0,
      },
      {
        where: { id },
        transaction: t,
      }
    );

    if (affectedRows === 0) {
      const error = new Error('Tidak ada data yang dihapus');
      error.statusCode = 404;
      throw error;
    }

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Jenis bahan berhasil dihapus',
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal menghapus jenis bahan';
    }
    next(error);
  }
};
