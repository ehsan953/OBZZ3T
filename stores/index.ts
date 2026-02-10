import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 0,
    name: 'Nuxt App',
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    increment() {
      this.counter++
    },
    decrement() {
      this.counter--
    },
    reset() {
      this.counter = 0
    },
  },
})
