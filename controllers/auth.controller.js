import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import sequelize from '../config/databaseConfig.js';

import models from '../models/init-models.js';
const { users } = models(sequelize);
// REGISTER
export const SignUp = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { nama_user, email, password, telephone_number } = req.body;

    // Validasi input
    if (!email || !password || !nama_user) {
      const error = new Error('Nama user, email, dan password harus diisi');
      error.statusCode = 400;
      throw error;
    }

    // Cek user sudah ada atau belum
    const existingUser = await users.findAll({
      where: { email: email },
      transaction: t,
    });

    if (existingUser.length !== 0) {
      const error = new Error('Email sudah terdaftar');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru
    const newUser = await users.create(
      {
        nama_user,
        email,
        password: hashedPassword,
        telephone_number: telephone_number || null,
      },
      {
        transaction: t,
      }
    );

    // Buat token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || JWT_EXPIRES_IN,
    });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Berhasil Mendaftar',
      data: {
        token,
        user: {
          id: newUser.id,
          nama_user: newUser.nama_user,
          email: newUser.email,
          telephone_number: newUser.telephone_number,
        },
      },
    });
  } catch (error) {
    // Rollback hanya jika transaction ada dan belum selesai
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

// LOGIN
export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // cari user
    const user = await users.findAll({ where: { email: email } });
    if (!user) {
      const error = new Error('Email atau password salah');
      error.statusCode = 404;
      throw error;
    }

    // cek password
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      const error = new Error('Email atau password salah');
      error.statusCode = 401;
      throw error;
    }

    // buat token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: 'Login Berhasil',
      data: {
        token,
        user: {
          nama_user: user[0].nama_user,
          email: user[0].email,
          telephone_number: user[0].telephone_number,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT (opsional — biasanya cukup hapus token di sisi client)
export const SignOut = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout Berhasil',
    });
  } catch (error) {
    next(error);
  }
};
