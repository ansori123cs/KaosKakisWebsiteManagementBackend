import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class pesanan_detail extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pesanan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pesanan',
        key: 'id'
      }
    },
    kaos_kaki_variasi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kaos_kaki_variasi',
        key: 'id'
      }
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harga_satuan: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pesanan_detail',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pesanan_detail_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
