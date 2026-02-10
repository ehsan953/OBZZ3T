# Pinia Stores

This directory contains your Pinia stores. In Nuxt 3, stores are auto-imported, so you can use them directly in your components without importing them.

## Usage Example

```vue
<script setup>
const mainStore = useMainStore()

// Access state
console.log(mainStore.counter)

// Use getters
console.log(mainStore.doubleCount)

// Call actions
mainStore.increment()
</script>
```

## Store Structure

Each store file should export a store using `defineStore`:
- **State**: The reactive data
- **Getters**: Computed values derived from state
- **Actions**: Methods that can mutate state

## Auto-imports

Nuxt automatically imports stores from this directory. You can use them directly:
- `stores/index.ts` → `useMainStore()`
- `stores/user.ts` → `useUserStore()`
- etc.
