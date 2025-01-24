import { CONFIG } from './Config';

export const Endpoint = {
  login: `${CONFIG.API_URL}/user/login`,
  signup: `${CONFIG.API_URL}/user/signup`,

  kategori: `${CONFIG.API_URL}/kategori`,
  detailKategori: (id) => `${CONFIG.API_URL}/kategori/${id}`,

  pemasok: `${CONFIG.API_URL}/pemasok`,
  detailPemasok: (id) => `${CONFIG.API_URL}/pemasok/${id}`,
  customer: `${CONFIG.API_URL}/customer`,
  detailCustomer: (id) => `${CONFIG.API_URL}/customer/${id}`,
  pembelian: `${CONFIG.API_URL}/pembelian`,
  detailPembelian: (id) => `${CONFIG.API_URL}/pembelian/${id}`,
  penjualan: `${CONFIG.API_URL}/penjualan`,
  detailPenjualan: (id) => `${CONFIG.API_URL}/penjualan/${id}`,

  sparepart: `${CONFIG.API_URL}/sparepart`,
  detailSparepart: (id) => `${CONFIG.API_URL}/sparepart/${id}`,

  historyPenjualan: `${CONFIG.API_URL}/historypenjualan`,
  historyPembelian: `${CONFIG.API_URL}/historypembelian`,
};
