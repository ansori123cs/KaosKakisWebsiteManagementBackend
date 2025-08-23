import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class data_mesin extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    kaos_kaki_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'kaos_kaki',
        key: 'id'
      }
    },
    jenis_mesin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'jenis_mesin',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'data_mesin',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "data_mesin_pkey1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
