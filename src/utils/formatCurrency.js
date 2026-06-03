let cachedRates = {
  IDR: 1,
  USD: 1 / 16000,
  SGD: 1 / 11800,
  MYR: 1 / 3400
};

try {
  const saved = localStorage.getItem('fingo_exchange_rates');
  if (saved) {
    const data = JSON.parse(saved);
    // Cek umur cache, jika kurang dari 1 jam (3600000 ms), gunakan
    if (Date.now() - data.timestamp < 3600000) {
      cachedRates = data.rates;
    }
  }
} catch (e) {}

// Fetch kurs live secara asinkron (background)
const fetchLiveRates = async () => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/IDR');
    const data = await res.json();
    if (data && data.rates) {
      cachedRates = { ...cachedRates, ...data.rates };
      localStorage.setItem('fingo_exchange_rates', JSON.stringify({
        timestamp: Date.now(),
        rates: cachedRates
      }));
    }
  } catch (e) {
    console.error('Gagal mengambil kurs real-time', e);
  }
};

// Jalankan fetch setiap kali file ini diinisialisasi
fetchLiveRates();

export const formatRupiah = (amount, prefs = {}) => {
  const currency = prefs.matauang || 'IDR';
  const locale = prefs.pemisah === 'Koma (1,000,000)' ? 'en-US' : 'id-ID';
  
  const convertedAmount = amount * (cachedRates[currency] || 1);

  if (prefs.formatPendek) {
    return new Intl.NumberFormat(locale, {
      style: 'currency', 
      currency, 
      notation: "compact", 
      maximumFractionDigits: currency !== 'IDR' ? 2 : 1
    }).format(convertedAmount);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency', 
    currency, 
    minimumFractionDigits: currency !== 'IDR' ? 2 : 0,
    maximumFractionDigits: currency !== 'IDR' ? 2 : 0,
  }).format(convertedAmount);
}

export const parseRupiah = (str) =>
  Number(str.replace(/[^0-9]/g, ''))