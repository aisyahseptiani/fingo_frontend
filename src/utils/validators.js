export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const isValidPassword = (password) =>
  password.length >= 8

export const isValidAmount = (amount) =>
  !isNaN(amount) && Number(amount) > 0

export const validateLoginForm = ({ email, password }) => {
  const errors = {}
  if (!isValidEmail(email)) errors.email = 'Email tidak valid'
  if (!password) errors.password = 'Password wajib diisi'
  return errors
}

export const validateRegisterForm = ({ name, email, password }) => {
  const errors = {}
  if (!name || name.length < 2) errors.name = 'Nama minimal 2 karakter'
  if (!isValidEmail(email)) errors.email = 'Email tidak valid'
  if (!isValidPassword(password)) errors.password = 'Password minimal 8 karakter'
  return errors
}