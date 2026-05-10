// services/authService.js

export async function login(data) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    user: {
      id: 1,
      name: 'Fingo User',
      email: data.email,
    },
    token: 'dummy-token-123',
  }
}

export async function register(data) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    success: true,
  }
}

export async function logout() {
  return true
}