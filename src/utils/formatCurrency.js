export const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount)

export const parseRupiah = (str) =>
  Number(str.replace(/[^0-9]/g, ''))