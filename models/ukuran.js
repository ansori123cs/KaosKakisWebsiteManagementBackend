import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ukuran extends Model {
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
      unique: "ukuran_nama_key"
    },
    kode_ukuran: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ukuran',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ukuran_nama_key",
        unique: true,
        fields: [
          { name: "nama" },
        ]
      },
      {
        name: "ukuran_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
