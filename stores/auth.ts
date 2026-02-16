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

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  message?: string
  user?: any
  token?: string
  [key: string]: any
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
             process.env.NUXT_PUBLIC_API_BASE_URL || 'https://ideal-neat-bunny.ngrok-free.app/api' ||
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

        // Handle API response structure: response.data.token or response.token
        const token = (response as any).data?.token || response.token
        const user = (response as any).data?.user || response.user

        // If the API returns a token, store it
        if (token) {
          this.token = token
          this.user = user || null
          
          // Store token in localStorage for persistence
          if (process.client) {
            localStorage.setItem('auth_token', token)
            // Also store user data if available
            if (user) {
              localStorage.setItem('user_data', JSON.stringify(user))
            }
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

    // Add this action inside the actions object in your store
    async login(data: LoginData): Promise<LoginResponse> {
      this.isLoading = true
      this.error = null

      try {
        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/login`

        // Create FormData as the API expects formdata
        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('password', data.password)

        const response = await $fetch<LoginResponse>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData,
        })

        // Handle API response structure: response.data.token or response.token
        const token = (response as any).data?.token || response.token
        const user = (response as any).data?.user || response.user

        // If the API returns a token, store it
        if (token) {
          this.token = token
          this.user = user || null
          
          // Store token in localStorage for persistence
          if (process.client) {
            localStorage.setItem('auth_token', token)
            // Also store user data if needed
            if (user) {
              localStorage.setItem('user_data', JSON.stringify(user))
            }
          }
        }

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        // Handle API error responses
        if (error.data) {
          // Handle validation errors
          if (error.data.errors) {
            // Format validation errors
            const errorMessages = Object.values(error.data.errors).flat()
            this.error = errorMessages.join(', ') || 'Login failed'
          } else {
            this.error = error.data.message || error.data.error || 'Login failed'
          }
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred during login'
        }

        throw error
      }
    },

    /**
     * Logout - Call API and clear auth state
     */
    async logout(): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        if (this.token) {
          const baseUrl = this.getApiBaseUrl()
          const url = `${baseUrl}/logout`

          // Call logout API endpoint
          await $fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.token}`,
            },
          })
        }
      } catch (error: any) {
        // Even if API call fails, we should still clear local state
        console.error('Logout API call failed:', error)
      } finally {
        // Always clear local state regardless of API call result
        this.user = null
        this.token = null
        this.error = null
        this.isLoading = false
        
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
        }
      }
    },

    /**
     * Get current user details from API
     */
    async getCurrentUser(): Promise<any> {
      if (!this.token) {
        throw new Error('Authentication required')
      }

      try {
        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/user`

        const response = await $fetch<{ data?: any; user?: any; [key: string]: any }>(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        })

        // Handle API response structure
        const user = (response as any).data?.user || response.user || response.data || response

        if (user) {
          this.user = user
          if (process.client) {
            localStorage.setItem('user_data', JSON.stringify(user))
          }
        }

        return user
      } catch (error: any) {
        // If token is invalid, clear auth state
        if (error.status === 401 || error.statusCode === 401) {
          this.logout()
        }
        throw error
      }
    },

    /**
     * Initialize auth state from stored token (on app load)
     */
    async initAuth() {
      if (process.client) {
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          this.token = storedToken
          
          // Try to restore user data from localStorage first (for faster initial load)
          const userData = localStorage.getItem('user_data')
          if (userData) {
            try {
              this.user = JSON.parse(userData)
            } catch (e) {
              console.error('Failed to parse user data', e)
            }
          }

          // Then fetch fresh user data from API to ensure it's up to date
          try {
            await this.getCurrentUser()
          } catch (error) {
            // If fetching fails (e.g., token expired), logout will be called in getCurrentUser
            console.error('Failed to fetch current user:', error)
          }
        }
      }
    },

    /**
     * Forgot Password - Send OTP to email
     */
    async forgotPassword(email: string): Promise<{ message?: string; [key: string]: any }> {
      this.isLoading = true
      this.error = null

      try {
        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/forgot-password`

        const formData = new FormData()
        formData.append('email', email)

        const response = await $fetch<{ message?: string; [key: string]: any }>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            // Don't set Content-Type for FormData - browser handles it automatically
          },
          body: formData,
        })

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        if (error.data) {
          if (error.data.errors) {
            const errorMessages = Object.values(error.data.errors).flat()
            this.error = errorMessages.join(', ') || 'Failed to send OTP'
          } else {
            this.error = error.data.message || error.data.error || 'Failed to send OTP'
          }
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }

        throw error
      }
    },

    /**
     * Verify OTP
     */
    async verifyOTP(email: string, otp: string): Promise<{ message?: string; [key: string]: any }> {
      this.isLoading = true
      this.error = null

      try {
        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/verify-otp`

        const formData = new FormData()
        formData.append('email', email)
        formData.append('otp', otp)

        const response = await $fetch<{ message?: string; [key: string]: any }>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formData,
        })

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        if (error.data) {
          if (error.data.errors) {
            const errorMessages = Object.values(error.data.errors).flat()
            this.error = errorMessages.join(', ') || 'OTP verification failed'
          } else {
            this.error = error.data.message || error.data.error || 'OTP verification failed'
          }
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }

        throw error
      }
    },

    /**
     * Reset Password
     */
    async resetPassword(
      email: string,
      otp: string,
      password: string,
      password_confirmation: string
    ): Promise<{ message?: string; [key: string]: any }> {
      this.isLoading = true
      this.error = null

      try {
        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/reset-password`

        const formData = new FormData()
        formData.append('email', email)
        formData.append('otp', otp)
        formData.append('password', password)
        formData.append('password_confirmation', password_confirmation)

        const response = await $fetch<{ message?: string; [key: string]: any }>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            // Don't set Content-Type for FormData - browser handles it automatically
          },
          body: formData,
        })

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        if (error.data) {
          if (error.data.errors) {
            const errorMessages = Object.values(error.data.errors).flat()
            this.error = errorMessages.join(', ') || 'Password reset failed'
          } else {
            this.error = error.data.message || error.data.error || 'Password reset failed'
          }
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }

        throw error
      }
    },

    /**
     * Send Email Verification
     */
    async sendEmailVerification(): Promise<{ message?: string; [key: string]: any }> {
      this.isLoading = true
      this.error = null

      try {
        if (!this.token) {
          throw new Error('Authentication required')
        }

        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/email/verification/send`

        const response = await $fetch<{ message?: string; [key: string]: any }>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        })

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        if (error.data) {
          this.error = error.data.message || error.data.error || 'Failed to send verification email'
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }

        throw error
      }
    },

    /**
     * Resend Email Verification
     */
    async resendEmailVerification(): Promise<{ message?: string; [key: string]: any }> {
      this.isLoading = true
      this.error = null

      try {
        if (!this.token) {
          throw new Error('Authentication required')
        }

        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/email/verification/resend`

        const response = await $fetch<{ message?: string; [key: string]: any }>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`,
          },
        })

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        if (error.data) {
          this.error = error.data.message || error.data.error || 'Failed to resend verification email'
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }

        throw error
      }
    },

    /**
     * Update User Profile
     */
    async updateProfile(profileData: {
      display_name?: string
      bio?: string
      city?: string
      state?: string
      age?: string
      phone_number?: string
      interests?: string[]
      profile_photos?: File[]
    }): Promise<{ message?: string; user?: any; [key: string]: any }> {
      this.isLoading = true
      this.error = null

      try {
        if (!this.token) {
          throw new Error('Authentication required')
        }

        const baseUrl = this.getApiBaseUrl()
        const url = `${baseUrl}/profile`

        const formData = new FormData()
        if (profileData.display_name) formData.append('display_name', profileData.display_name)
        if (profileData.bio) formData.append('bio', profileData.bio)
        if (profileData.city) formData.append('city', profileData.city)
        if (profileData.state) formData.append('state', profileData.state)
        if (profileData.age) formData.append('age', profileData.age)
        if (profileData.phone_number) formData.append('phone_number', profileData.phone_number)
        
        if (profileData.interests) {
          profileData.interests.forEach(interest => {
            formData.append('interests[]', interest)
          })
        }
        
        if (profileData.profile_photos) {
          profileData.profile_photos.forEach(photo => {
            formData.append('profile_photos[]', photo)
          })
        }

        const response = await $fetch<{ message?: string; user?: any; [key: string]: any }>(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            // Don't set Content-Type for FormData - browser handles it automatically with boundary
          },
          body: formData,
        })

        // Update user data if returned
        const user = (response as any).data?.user || response.user
        if (user) {
          this.user = user
          if (process.client) {
            localStorage.setItem('user_data', JSON.stringify(user))
          }
        }

        this.isLoading = false
        return response
      } catch (error: any) {
        this.isLoading = false
        
        if (error.data) {
          if (error.data.errors) {
            const errorMessages = Object.values(error.data.errors).flat()
            this.error = errorMessages.join(', ') || 'Profile update failed'
          } else {
            this.error = error.data.message || error.data.error || 'Profile update failed'
          }
        } else if (error.message) {
          this.error = error.message
        } else {
          this.error = 'An unexpected error occurred'
        }

        throw error
      }
    },
  },
})
