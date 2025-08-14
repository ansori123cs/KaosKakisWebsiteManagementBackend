import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class kaos_kaki_variasi extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kaos_kaki_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kaos_kaki',
        key: 'id'
      },
      unique: "uk_variasi"
    },
    ukuran_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ukuran',
        key: 'id'
      },
      unique: "uk_variasi"
    },
    warna_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warna',
        key: 'id'
      },
      unique: "uk_variasi"
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'kaos_kaki_variasi',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "kaos_kaki_variasi_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "uk_variasi",
        unique: true,
        fields: [
          { name: "kaos_kaki_id" },
          { name: "ukuran_id" },
          { name: "warna_id" },
        ]
      },
    ]
  });
  }
}
