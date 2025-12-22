import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { authApi, type LoginRequest } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | { email: string; name?: string; role: string }>(null)
  const error = ref<string>('')
  const isLoading = ref(false)
  const router = useRouter()

  // JWT token'dan user bilgisini decode et
  function decodeToken(token: string) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error('Token decode error:', e)
      return null
    }
  }

  // Role'ü token'dan çıkar
  function extractRole(decoded: any): string | null {
    if (!decoded) {
      console.warn('Decoded token is null or undefined')
      return null
    }
    
    // Token içeriğini logla (debug için)
    console.log('=== TOKEN DECODE DEBUG ===')
    console.log('Full decoded token:', JSON.stringify(decoded, null, 2))
    console.log('decoded.role:', decoded.role)
    console.log('All keys:', Object.keys(decoded))
    
    // Role field'ını kontrol et (backend'de artık var)
    if (decoded.role) {
      let role = String(decoded.role)
      
      // ROLE_ prefix'ini kaldır (ROLE_ADMIN -> ADMIN)
      if (role.startsWith('ROLE_')) {
        role = role.replace('ROLE_', '')
      }
      
      // Uppercase'e çevir
      role = role.toUpperCase()
      
      console.log('✅ Role found in token:', role)
      console.log('=== END TOKEN DEBUG ===')
      
      return role
    }
    
    // Role bulunamadıysa null döndür
    console.warn('⚠️ ROLE NOT FOUND IN TOKEN! Will try /auth/me endpoint.')
    console.warn('Available fields:', Object.keys(decoded))
    return null
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = ''
    try {
      // Eski user bilgisini temizle (yanlış role olabilir)
      localStorage.removeItem('user')
      
      const credentials: LoginRequest = { email, password }
      const response = await authApi.login(credentials)
      
      if (!response.accessToken) {
        throw new Error('No access token received')
      }
      
      // Token'dan user bilgisini decode et
      const decoded = decodeToken(response.accessToken)
      
      if (!decoded) {
        throw new Error('Failed to decode token')
      }
      
      // Token'dan role çıkarmayı dene
      let userRole = extractRole(decoded)
      
      // Eğer token'da role yoksa, backend'den user bilgisini çek (/api/auth/me)
      if (!userRole) {
        console.log('Role not in token, fetching from /api/auth/me endpoint...')
        try {
          const userInfo = await authApi.getCurrentUser()
          userRole = userInfo.role?.toUpperCase() || null
          
          if (userRole) {
            // ROLE_ prefix'ini temizle
            if (userRole.startsWith('ROLE_')) {
              userRole = userRole.replace('ROLE_', '')
            }
            userRole = userRole.toUpperCase()
            console.log('✅ Role from /api/auth/me:', userRole)
          } else {
            throw new Error('Role not found in /api/auth/me response')
          }
        } catch (err: any) {
          console.error('❌ Failed to fetch user info from /api/auth/me:', err)
          throw new Error('Could not determine user role. Please contact administrator.')
        }
      }
      
      if (!userRole) {
        throw new Error('Could not determine user role')
      }
      
      // ROLE_ prefix'ini temizle
      if (userRole.startsWith('ROLE_')) {
        userRole = userRole.replace('ROLE_', '')
      }
      userRole = userRole.toUpperCase()
      
      const userName = decoded?.sub || decoded?.email || decoded?.username || email
      
      user.value = {
        email: decoded?.email || decoded?.sub || decoded?.username || email,
        name: decoded?.firstName 
          ? `${decoded.firstName} ${decoded.lastName || ''}`.trim() 
          : decoded?.name || userName,
        role: userRole
      }
      
      // Debug için console'a yazdır
      console.log('✅ Final User object:', user.value)
      console.log('✅ User role:', user.value.role)
      
      // localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(user.value))
      
      error.value = ''
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Invalid email or password.'
      console.error('❌ Login error:', err)
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authApi.logout()
    user.value = null
    router.push('/login')
  }

  function checkAuth() {
    const token = localStorage.getItem('accessToken')
    const saved = localStorage.getItem('user')
    
    if (token && saved) {
      // Kaydedilmiş user bilgisini yükle
      user.value = JSON.parse(saved)
    } else if (token) {
      // Token var ama user bilgisi yok, token'dan decode et
      const decoded = decodeToken(token)
      if (decoded) {
        const userRole = extractRole(decoded)
        user.value = {
          email: decoded?.email || decoded?.sub || decoded?.username || '',
          name: decoded?.firstName 
            ? `${decoded.firstName} ${decoded.lastName || ''}`.trim() 
            : decoded?.name || '',
          role: userRole
        }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
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

