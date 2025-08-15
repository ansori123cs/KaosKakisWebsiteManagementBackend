import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class kaos_kaki extends Model {
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
      unique: "uk_nama_jenis"
    },
    jenis_bahan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'jenis_bahan',
        key: 'id'
      },
      unique: "uk_nama_jenis"
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    last_order_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    kode_kaos_kaki: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'kaos_kaki',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "kaos_kaki_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "uk_nama_jenis",
        unique: true,
        fields: [
          { name: "nama" },
          { name: "jenis_bahan_id" },
        ]
      },
    ]
  });
  }
}
