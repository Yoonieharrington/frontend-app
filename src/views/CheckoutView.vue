<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()
const customerName = ref('')
const customerPhone = ref('')
const message = ref('')
const showSuccess = ref(false) // ⭐️ SUCCESS POPUP STATE

// BACKEND URL
const apiBase = 'https://express-backend-9cfm.onrender.com'

// helper validations
function nameValid(name) {
  return /^[A-Za-z\s]+$/.test(name)
}
function phoneValid(phone) {
  return /^[0-9]+$/.test(phone)
}

async function checkout() {
  if (!nameValid(customerName.value)) {
    message.value = 'Name must contain letters only'
    return
  }
  if (!phoneValid(customerPhone.value)) {
    message.value = 'Phone must contain numbers only'
    return
  }
  if (cartStore.cart.length === 0) {
    message.value = 'Cart is empty'
    return
  }

  const order = {
    name: customerName.value,
    phone: customerPhone.value,
    lessonIDs: cartStore.cart.map((i) => i.id),
    quantities: cartStore.cart.map((i) => i.quantity),
  }

  try {
    // Save order
    const res = await fetch(`${apiBase}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Order failed')

    // Update lessons
    const updatePromises = cartStore.cart.map((item) => {
      const newSpaces = Number(item.availableSpaces)
      return fetch(`${apiBase}/lessons/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableSpaces: newSpaces }),
      })
    })
    await Promise.all(updatePromises)

    // SUCCESS POPUP
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 2600)

    // Reset
    message.value = 'Order placed successfully!'
    cartStore.cart = []
    customerName.value = ''
    customerPhone.value = ''
  } catch (err) {
    console.error(err)
    message.value = err.message || 'Order failed'
  }
}
</script>

<template>
  <div class="container">
    <h1>Checkout</h1>

    <div v-if="cartStore.cart.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div v-for="item in cartStore.cart" :key="item.id" class="cart-item">
        <strong>{{ item.subject }}</strong>
        <p>Qty: {{ item.quantity }} — Price: £{{ item.price }}</p>
        <button @click="cartStore.removeFromCart(item.id)">Remove</button>
      </div>
    </div>

    <h3>Your details</h3>

    <input v-model="customerName" placeholder="Full name (letters only)" />
    <input v-model="customerPhone" placeholder="Phone (numbers only)" />

    <button
      :disabled="
        !nameValid(customerName) || !phoneValid(customerPhone) || cartStore.cart.length === 0
      "
      @click="checkout"
    >
      Checkout
    </button>

    <p>{{ message }}</p>
  </div>

  <!-- ⭐️ SUCCESS POPUP -->
  <div v-if="showSuccess" class="popup-overlay">
    <div class="popup-box">
      <h2>✓ Order Successful!</h2>
      <p>Your booking has been confirmed.</p>
    </div>
  </div>
</template>

<style>
/* CHECKOUT PAGE */
.container {
  max-width: 650px;
  margin: 40px auto;
  background: white;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.09);
  color: #0a1a33;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 1.9rem;
  color: #0a1a33;
}

/* CART ITEM */
.cart-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
}

/* INPUTS */
input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.2s;
}
input:focus {
  border-color: #0a1a33;
  box-shadow: 0 0 0 2px rgba(10, 26, 51, 0.2);
}

/* BUTTON */
button {
  width: 100%;
  padding: 14px;
  background: #0a1a33;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 10px;
}
button:hover {
  background: #133260;
}
button:disabled {
  background: #6b7280;
}

/* SUCCESS POPUP */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease forwards;
  z-index: 1000;
}

.popup-box {
  background: white;
  padding: 25px 35px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  animation: popScale 0.25s ease forwards;
  color: #0a1a33;
}

.popup-box h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes popScale {
  0% {
    transform: scale(0.6);
  }
  100% {
    transform: scale(1);
  }
}
</style>
