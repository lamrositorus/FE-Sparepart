// Create a formatter for Indonesian Rupiah
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
export const formatMonth = (month) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 
    'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 
    'November', 'Desember'
  ];
  return months[month - 1]; // month is 1-based
};
