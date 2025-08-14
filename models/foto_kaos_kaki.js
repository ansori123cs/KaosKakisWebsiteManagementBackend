import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class foto_kaos_kaki extends Model {
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
      }
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'foto_kaos_kaki',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "foto_kaos_kaki_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
