import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class pesanan extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama_pemesan: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pesanan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pesanan_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
