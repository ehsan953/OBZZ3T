export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state on app load
  // This must complete before pages render to avoid showing guest views
  try {
    await authStore.initAuth()
  } catch (error) {
    console.error('Failed to initialize auth:', error)
    // If init fails, ensure we're logged out
    authStore.logout()
  }
})
