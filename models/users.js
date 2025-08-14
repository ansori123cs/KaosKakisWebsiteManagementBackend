import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class users extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          autoIncrementIdentity: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        nama_user: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        refresh_token: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'refresh_token_secret_key',
        },
        telephone_number: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'users',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
