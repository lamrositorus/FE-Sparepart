// Create a formatter for Indonesian Rupiah
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};
export const formatMonth = (month) => {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(month));
}