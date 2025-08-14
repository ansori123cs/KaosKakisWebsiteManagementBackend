import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _data_mesin from  "./data_mesin.js";
import _foto_kaos_kaki from  "./foto_kaos_kaki.js";
import _jenis_bahan from  "./jenis_bahan.js";
import _jenis_mesin from  "./jenis_mesin.js";
import _kaos_kaki from  "./kaos_kaki.js";
import _kaos_kaki_variasi from  "./kaos_kaki_variasi.js";
import _pesanan from  "./pesanan.js";
import _pesanan_detail from  "./pesanan_detail.js";
import _ukuran from  "./ukuran.js";
import _users from  "./users.js";
import _warna from  "./warna.js";

export default function initModels(sequelize) {
  const data_mesin = _data_mesin.init(sequelize, DataTypes);
  const foto_kaos_kaki = _foto_kaos_kaki.init(sequelize, DataTypes);
  const jenis_bahan = _jenis_bahan.init(sequelize, DataTypes);
  const jenis_mesin = _jenis_mesin.init(sequelize, DataTypes);
  const kaos_kaki = _kaos_kaki.init(sequelize, DataTypes);
  const kaos_kaki_variasi = _kaos_kaki_variasi.init(sequelize, DataTypes);
  const pesanan = _pesanan.init(sequelize, DataTypes);
  const pesanan_detail = _pesanan_detail.init(sequelize, DataTypes);
  const ukuran = _ukuran.init(sequelize, DataTypes);
  const users = _users.init(sequelize, DataTypes);
  const warna = _warna.init(sequelize, DataTypes);

  kaos_kaki.belongsTo(jenis_bahan, { as: "jenis_bahan", foreignKey: "jenis_bahan_id"});
  jenis_bahan.hasMany(kaos_kaki, { as: "kaos_kakis", foreignKey: "jenis_bahan_id"});
  data_mesin.belongsTo(jenis_mesin, { as: "jenis_mesin", foreignKey: "jenis_mesin_id"});
  jenis_mesin.hasMany(data_mesin, { as: "data_mesins", foreignKey: "jenis_mesin_id"});
  data_mesin.belongsTo(kaos_kaki, { as: "kaos_kaki", foreignKey: "kaos_kaki_id"});
  kaos_kaki.hasMany(data_mesin, { as: "data_mesins", foreignKey: "kaos_kaki_id"});
  foto_kaos_kaki.belongsTo(kaos_kaki, { as: "kaos_kaki", foreignKey: "kaos_kaki_id"});
  kaos_kaki.hasMany(foto_kaos_kaki, { as: "foto_kaos_kakis", foreignKey: "kaos_kaki_id"});
  kaos_kaki_variasi.belongsTo(kaos_kaki, { as: "kaos_kaki", foreignKey: "kaos_kaki_id"});
  kaos_kaki.hasMany(kaos_kaki_variasi, { as: "kaos_kaki_variasis", foreignKey: "kaos_kaki_id"});
  pesanan_detail.belongsTo(kaos_kaki_variasi, { as: "kaos_kaki_variasi", foreignKey: "kaos_kaki_variasi_id"});
  kaos_kaki_variasi.hasMany(pesanan_detail, { as: "pesanan_details", foreignKey: "kaos_kaki_variasi_id"});
  pesanan_detail.belongsTo(pesanan, { as: "pesanan", foreignKey: "pesanan_id"});
  pesanan.hasMany(pesanan_detail, { as: "pesanan_details", foreignKey: "pesanan_id"});
  kaos_kaki_variasi.belongsTo(ukuran, { as: "ukuran", foreignKey: "ukuran_id"});
  ukuran.hasMany(kaos_kaki_variasi, { as: "kaos_kaki_variasis", foreignKey: "ukuran_id"});
  kaos_kaki_variasi.belongsTo(warna, { as: "warna", foreignKey: "warna_id"});
  warna.hasMany(kaos_kaki_variasi, { as: "kaos_kaki_variasis", foreignKey: "warna_id"});

  return {
    data_mesin,
    foto_kaos_kaki,
    jenis_bahan,
    jenis_mesin,
    kaos_kaki,
    kaos_kaki_variasi,
    pesanan,
    pesanan_detail,
    ukuran,
    users,
    warna,
  };
}
