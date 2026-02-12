import { defineStore } from 'pinia'

interface SignupData {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}

interface SignupResponse {
  message?: string
  user?: any
  token?: string
  [key: string]: any
}

interface AuthState {
  user: any | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    getApiBaseUrl(): string {
      const config = useRuntimeConfig()
      // Check runtime config first, then fallback to env variable, then default
      return config.public.apiBaseUrl || 
             process.env.NUXT_PUBLIC_API_BASE_URL || 
             'http://localhost:8000/api'
    },

    async signup(data: SignupData): Promise<SignupResponse> {
      this.isLoading = true
      this.error = null

      try {
        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/register`

        // Create FormData as the API expects formdata
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('username', data.username)
        formData.append('email', data.email)
        formData.append('password', data.password)
        formData.append('password_confirmation', data.password_confirmation)

        // Use $fetch with FormData - don't set Content-Type header, browser will set it automatically with boundary
        const response = await $fetch<SignupResponse>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            // Don't set Content-Type for FormData - browser handles it
          },
          body: formData,
        })

        // If the API returns a token, store it
        if (response.token) {
          this.token = response.token
          this.user = response.user || null
          
          // Optionally store token in localStorage/cookie for persistence
          if (process.client) {
            localStorage.setItem('auth_token', response.token)
          }
        }

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        // Handle API error responses
        if (error.data) {
          this.error = error.data.message || error.data.error || 'Signup failed'
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred during signup'
        }

        throw error
      }
    },

    /**
     * Clear auth state (logout)
     */
    logout() {
      this.user = null
      this.token = null
      this.error = null
      
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    },

    /**
     * Initialize auth state from stored token (on app load)
     */
    initAuth() {
      if (process.client) {
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          this.token = storedToken
        }
      }
    },
  },
})
