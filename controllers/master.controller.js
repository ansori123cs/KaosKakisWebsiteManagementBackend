import sequelize from '../config/databaseConfig.js';

import models from '../models/init-models.js';
const { jenis_bahan, jenis_mesin, ukuran, warna } = models(sequelize);

//modul jenis bahan=============================================================================//

//get all jenis bahan
export const getAllJenisBahan = async (req, res, next) => {
  try {
    const jenisBahanList = await jenis_bahan.findAll();

    if (jenisBahanList.length === 0 || !jenisBahanList) {
      const error = new Error('List Jenis Bahan Kosong');
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'List Jenis Bahan',
      data: {
        jenisBahanList: jenisBahanList,
      },
    });
  } catch (error) {
    next(error);
  }
};

//create new jenis bahan
export const createNewJenisBahan = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { nama_jenis_b, kode_jenis_b } = req.body;

    // Validasi input
    if (!nama_jenis_b || !kode_jenis_b) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek bahan sudah ada atau belum
    const existingJenisBahan = await jenis_bahan.findAll({
      where: { nama: nama_jenis_b },
      transaction: t,
    });

    if (existingJenisBahan.length !== 0) {
      const error = new Error('Jenis Bahan Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisBahan = await jenis_bahan.create(
      {
        nama: nama_jenis_b,
        kode_bahan: kode_jenis_b,
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
        kode_jenis_b: kode_jenis_b,
        nama_jenis_b: nama_jenis_b,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

//update jenis bahan

export const updateJenisBahan = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { nama_jenis_b, kode_jenis_b } = req.body;

    // Validasi input
    if (!kode_jenis_b) {
      const error = new Error('Silahka pilih Jenis Bahan');
      error.statusCode = 400;
      throw error;
    }

    const updateJenisBahan = await jenis_bahan.update(
      {
        nama: nama_jenis_b,
      },
      {
        where: {
          kode_bahan: kode_jenis_b,
        },
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Sukses Jenis Bahan Diupdate',
      data: {
        kode_jenis_b: kode_jenis_b,
        nama_jenis_b: nama_jenis_b,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

//delete Jenis Bahan
export const deleteJenisBahan = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const { kode_jenis_b } = req.body;

    // Validasi input
    if (!kode_jenis_b) {
      const error = new Error('Silahka pilih Jenis Bahan');
      error.statusCode = 400;
      throw error;
    }

    const deleteJenisBahan = await jenis_bahan.destroy(
      {
        where: {
          kode_bahan: kode_jenis_b,
        },
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json({
      success: true,
      message: 'Sukses Jenis Bahan Diupdate',
      data: {
        kode_jenis_b: kode_jenis_b,
        nama_jenis_b: nama_jenis_b,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

//modul jenis mesin=============================================================================//

//create new jenis mesin
export const createNewJenisMesin = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { nama_jenis_m, kode_jenis_m } = req.body;

    // Validasi input
    if (!nama_jenis_m || !kode_jenis_m) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek user sudah ada atau belum
    const existingJenisMesin = await jenis_mesin.findAll({
      where: { nama: nama_jenis_m },
      transaction: t,
    });

    if (existingJenisMesin.length !== 0) {
      const error = new Error('Jenis Mesin Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisMesin = await jenis_mesin.create(
      {
        nama: nama_jenis_m,
        kode_mesin: kode_jenis_m,
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
        kode_jenis_m: kode_jenis_m,
        nama_jenis_m: nama_jenis_m,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

//create new jenis ukuran
export const createNewJenisUkuran = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { nama_jenis_u, kode_jenis_u } = req.body;

    // Validasi input
    if (!nama_jenis_u) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek user sudah ada atau belum
    const existingJenisUkuran = await ukuran.findAll({
      where: { nama: nama_jenis_u },
      transaction: t,
    });

    if (existingJenisUkuran.length !== 0) {
      const error = new Error('Jenis Ukuran Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisUkuran = await ukuran.create(
      {
        nama: nama_jenis_u,
        kode_ukuran: kode_jenis_u,
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
        kode_jenis_u: kode_jenis_u,
        nama_jenis_u: nama_jenis_u,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

//create new jenis warna
export const createNewJenisWarna = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { nama_jenis_w, kode_jenis_w } = req.body;

    // Validasi input
    if (!nama_jenis_w) {
      const error = new Error('Nama Jenis dan Kode Harus Di isi');
      error.statusCode = 400;
      throw error;
    }

    // Cek user sudah ada atau belum
    const existingJenisWarna = await warna.findAll({
      where: { nama: nama_jenis_w },
      transaction: t,
    });

    if (existingJenisWarna.length !== 0) {
      const error = new Error('Jenis Warna Sudah Ada!');
      error.statusCode = 409;
      throw error;
    }

    const newJenisWarna = await warna.create(
      {
        nama: nama_jenis_w,
        kode_warna: kode_jenis_w,
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
        kode_jenis_w: kode_jenis_w,
        nama_jenis_w: nama_jenis_w,
      },
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};
