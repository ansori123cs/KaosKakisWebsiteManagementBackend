import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class warna extends Model {
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
      unique: "warna_nama_key"
    }
  }, {
    sequelize,
    tableName: 'warna',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "warna_nama_key",
        unique: true,
        fields: [
          { name: "nama" },
        ]
      },
      {
        name: "warna_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
