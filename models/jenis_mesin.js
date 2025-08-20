import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class jenis_mesin extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "data_mesin_nama_key"
    },
    kode_mesin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'jenis_mesin',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "data_mesin_nama_key",
        unique: true,
        fields: [
          { name: "nama" },
        ]
      },
      {
        name: "data_mesin_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
