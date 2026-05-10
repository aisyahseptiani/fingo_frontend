export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

export const formatDateShort = (dateStr) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short',
  })

export const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  })