export const formatRupiah = (amount, prefs = {}) => {
  const currency = prefs.matauang || 'IDR';
  const locale = prefs.pemisah === 'Koma (1,000,000)' ? 'en-US' : 'id-ID';

  if (prefs.formatPendek) {
    return new Intl.NumberFormat(locale, {
      style: 'currency', 
      currency, 
      notation: "compact", 
      maximumFractionDigits: 1
    }).format(amount);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency', 
    currency, 
    minimumFractionDigits: 0,
  }).format(amount);
}

export const parseRupiah = (str) =>
  Number(str.replace(/[^0-9]/g, ''))