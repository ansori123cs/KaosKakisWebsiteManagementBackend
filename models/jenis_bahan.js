import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class jenis_bahan extends Model {
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
      unique: "jenis_bahan_nama_key"
    },
    kode_bahan: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'jenis_bahan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "jenis_bahan_nama_key",
        unique: true,
        fields: [
          { name: "nama" },
        ]
      },
      {
        name: "jenis_bahan_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
