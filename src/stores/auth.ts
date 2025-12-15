import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

// Basit bir kullanıcı havuzu/mock
const users = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
  { username: 'doctor1', password: 'docpass', name: 'Dr. Smith', role: 'doctor' },
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | { username: string; name: string; role: string }>(null)
  const error = ref<string>('')
  const isLoading = ref(false)
  const router = useRouter()

  async function login(username: string, password: string) {
    isLoading.value = true
    error.value = ''
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API
    const found = users.find(
      (u) => u.username === username && u.password === password
    )
    isLoading.value = false
    if (found) {
      user.value = { username: found.username, name: found.name, role: found.role }
      localStorage.setItem('user', JSON.stringify(user.value))
      error.value = ''
      router.push('/dashboard')
    } else {
      error.value = 'Invalid username or password.'
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  function checkAuth() {
    const saved = localStorage.getItem('user')
    if (saved) {
      user.value = JSON.parse(saved)
    }
  }

  return {
    user,
    error,
    isLoading,
    login,
    logout,
    checkAuth
  }
})

