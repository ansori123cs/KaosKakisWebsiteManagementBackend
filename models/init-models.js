import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _data_mesin from  "./data_mesin.js";
import _foto_kaos_kaki from  "./foto_kaos_kaki.js";
import _jenis_bahan from  "./jenis_bahan.js";
import _jenis_mesin from  "./jenis_mesin.js";
import _kaos_kaki from  "./kaos_kaki.js";
import _kaos_kaki_variasi_detail from  "./kaos_kaki_variasi_detail.js";
import _pesanan from  "./pesanan.js";
import _pesanan_detail from  "./pesanan_detail.js";
import _status from  "./status.js";
import _stok_kaos_kaki from  "./stok_kaos_kaki.js";
import _ukuran from  "./ukuran.js";
import _users from  "./users.js";
import _warna from  "./warna.js";

export default function initModels(sequelize) {
  const data_mesin = _data_mesin.init(sequelize, DataTypes);
  const foto_kaos_kaki = _foto_kaos_kaki.init(sequelize, DataTypes);
  const jenis_bahan = _jenis_bahan.init(sequelize, DataTypes);
  const jenis_mesin = _jenis_mesin.init(sequelize, DataTypes);
  const kaos_kaki = _kaos_kaki.init(sequelize, DataTypes);
  const kaos_kaki_variasi_detail = _kaos_kaki_variasi_detail.init(sequelize, DataTypes);
  const pesanan = _pesanan.init(sequelize, DataTypes);
  const pesanan_detail = _pesanan_detail.init(sequelize, DataTypes);
  const status = _status.init(sequelize, DataTypes);
  const stok_kaos_kaki = _stok_kaos_kaki.init(sequelize, DataTypes);
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
  kaos_kaki_variasi_detail.belongsTo(kaos_kaki, { as: "kaos_kaki", foreignKey: "kaos_kaki_id"});
  kaos_kaki.hasMany(kaos_kaki_variasi_detail, { as: "kaos_kaki_variasi_details", foreignKey: "kaos_kaki_id"});
  stok_kaos_kaki.belongsTo(kaos_kaki, { as: "id_kaos_kaos_kaki", foreignKey: "id_kaos"});
  kaos_kaki.hasMany(stok_kaos_kaki, { as: "stok_kaos_kakis", foreignKey: "id_kaos"});
  pesanan_detail.belongsTo(kaos_kaki_variasi_detail, { as: "kaos_kaki_variasi", foreignKey: "kaos_kaki_variasi_id"});
  kaos_kaki_variasi_detail.hasMany(pesanan_detail, { as: "pesanan_details", foreignKey: "kaos_kaki_variasi_id"});
  pesanan_detail.belongsTo(pesanan, { as: "pesanan", foreignKey: "pesanan_id"});
  pesanan.hasMany(pesanan_detail, { as: "pesanan_details", foreignKey: "pesanan_id"});
  kaos_kaki_variasi_detail.belongsTo(ukuran, { as: "ukuran", foreignKey: "ukuran_id"});
  ukuran.hasMany(kaos_kaki_variasi_detail, { as: "kaos_kaki_variasi_details", foreignKey: "ukuran_id"});
  stok_kaos_kaki.belongsTo(ukuran, { as: "id_ukuran_ukuran", foreignKey: "id_ukuran"});
  ukuran.hasMany(stok_kaos_kaki, { as: "stok_kaos_kakis", foreignKey: "id_ukuran"});
  kaos_kaki_variasi_detail.belongsTo(warna, { as: "warna", foreignKey: "warna_id"});
  warna.hasMany(kaos_kaki_variasi_detail, { as: "kaos_kaki_variasi_details", foreignKey: "warna_id"});
  stok_kaos_kaki.belongsTo(warna, { as: "id_warna_warna", foreignKey: "id_warna"});
  warna.hasMany(stok_kaos_kaki, { as: "stok_kaos_kakis", foreignKey: "id_warna"});

  return {
    data_mesin,
    foto_kaos_kaki,
    jenis_bahan,
    jenis_mesin,
    kaos_kaki,
    kaos_kaki_variasi_detail,
    pesanan,
    pesanan_detail,
    status,
    stok_kaos_kaki,
    ukuran,
    users,
    warna,
  };
}
