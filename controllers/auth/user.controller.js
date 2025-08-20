// controllers/user.controller.js
import sequelize from '../../config/databaseConfig.js';

import models from '../../models/init-models.js';
const { users } = models(sequelize);

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await users.findAll({
      attributes: { exclude: ['password'] }, // jangan kirim password
    });

    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await users.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }, // exclude password
    });

    if (!user) {
      const err = new Error('User Not Found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
