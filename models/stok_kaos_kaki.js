import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class stok_kaos_kaki extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_kaos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kaos_kaki',
        key: 'id'
      }
    },
    id_ukuran: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ukuran',
        key: 'id'
      }
    },
    id_warna: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'warna',
        key: 'id'
      }
    },
    stok: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'stok_kaos_kaki',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "stok_kaos_kaki_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
