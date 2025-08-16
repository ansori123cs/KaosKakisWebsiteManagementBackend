import sequelize from '../../config/databaseConfig.js';

import models from '../../models/init-models.js';
const { jenis_mesin } = models(sequelize);

//get all jenis mesin
export const getAllJenisMesin = async (req, res, next) => {
  try {
    // Default values untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Dapatkan data dengan pagination
    const { count, rows: jenisMesinList } = await jenis_mesin.findAndCountAll({
      limit,
      offset,
      // order: [['createdAt', 'DESC']], // Urutkan berdasarkan yang terbaru
    });

    // Hitung total pages
    const totalPages = Math.ceil(count / limit);

    // Jika tidak ada data
    if (jenisMesinList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Data jenis Mesin kosong',
        data: {
          jenisMesinList: [],
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
      message: 'List Jenis Mesin berhasil diambil',
      data: {
        jenisMesinList,
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
      error.message = 'Gagal mengambil data jenis mesin';
    }
    next(error);
  }
};

//create new jenis mesin
export const createNewJenisMesin = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!nama_jenis || !kode_jenis) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek mesin sudah ada atau belum
    const existingJenisMesin = await jenis_mesin.findAll({
      where: { nama: nama_jenis },
      transaction: t,
    });

    if (existingJenisMesin.length !== 0) {
      const error = new Error('Jenis Mesin Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisMesin = await jenis_mesin.create(
      {
        nama: nama_jenis,
        kode_mesin: kode_jenis,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Sukses Jenis Mesin Baru Dibuat',
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
      error.message = 'Gagal create jenis mesin';
    }
    next(error);
  }
};

//update jenis mesin
export const updateJenisMesin = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params; // Menggunakan ID sebagai parameter
    const { nama_jenis, kode_jenis } = req.body;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis Mesin harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    if (!nama_jenis?.trim() || !kode_jenis?.trim()) {
      const error = new Error('Nama dan kode mesin harus diisi');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingMesin = await jenis_mesin.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingMesin) {
      const error = new Error('Jenis mesin tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Cek duplikasi kode mesin (kecuali untuk record ini)
    const duplicateKode = await jenis_mesin.findOne({
      where: {
        kode_mesin: kode_jenis,
        id: { [Op.ne]: id }, // Tidak termasuk record saat ini
      },
      transaction: t,
    });

    if (duplicateKode) {
      const error = new Error('Kode mesin sudah digunakan oleh jenis mesin lain');
      error.statusCode = 409;
      throw error;
    }

    // Cek duplikasi nama (kecuali untuk record ini)
    const duplicateNama = await jenis_mesin.findOne({
      where: {
        nama: nama_jenis,
        id: { [Op.ne]: id },
      },
      transaction: t,
    });

    if (duplicateNama) {
      const error = new Error('Nama Mesin sudah digunakan oleh jenis Mesin lain');
      error.statusCode = 409;
      throw error;
    }

    // Update data
    const [affectedRows] = await jenis_mesin.update(
      {
        nama: nama_jenis.trim(),
        kode_mesin: kode_jenis.trim(),
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
    const updatedMesin = await jenis_mesin.findOne({
      where: { id },
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Jenis mesin berhasil diupdate',
      data: updatedMesin,
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal mengupdate jenis mesin';
    }
    next(error);
  }
};

//delete Jenis Mesin
export const deleteJenisMesin = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;

    // Validasi input
    if (!id) {
      const error = new Error('ID Jenis Mesin harus disertakan');
      error.statusCode = 400;
      throw error;
    }

    // Cek apakah data ada
    const existingMesin = await jenis_mesin.findOne({
      where: { id },
      transaction: t,
    });

    if (!existingMesin) {
      const error = new Error('Jenis mesin tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Hapus data
    const [affectedRows] = await jenis_mesin.destroy({
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
      message: 'Jenis mesin berhasil dihapus',
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Gagal menghapus jenis mesin';
    }
    next(error);
  }
};
