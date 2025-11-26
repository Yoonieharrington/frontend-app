import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  function addToCart(lesson) {
    const found = cart.value.find((i) => i.id === lesson.id)
    if (found) {
      found.quantity = (found.quantity || 0) + 1
    } else {
      // copy data and store current availableSpaces for later update
      cart.value.push({ ...lesson, quantity: 1 })
    }
  }

  function removeFromCart(id) {
    const item = cart.value.find((i) => i.id === id)
    if (!item) return
    // restore local lesson spaces in UI is handled in HomeView where we decreased availableSpaces when adding
    cart.value = cart.value.filter((i) => i.id !== id)
  }

  function cartCount() {
    return cart.value.reduce((s, i) => s + (i.quantity || 0), 0)
  }

  return { cart, addToCart, removeFromCart, cartCount }
})
