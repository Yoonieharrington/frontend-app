<template>
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="nav-left">
        <h2 class="logo">LessonBox</h2>
      </div>

      <div class="nav-right">
        <router-link to="/" class="nav-link" active-class="active">Home</router-link>

        <router-link to="/checkout" class="nav-link checkout-link" active-class="active">
          Checkout
          <span v-if="cartStore.cart.length > 0" class="cart-badge">
            {{ cartStore.cart.length }}
          </span>
        </router-link>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useCartStore } from './stores/cartStore'
const cartStore = useCartStore()
</script>

<style>
/* GLOBAL */
body {
  margin: 0;
  background: #f3f4f6;
  font-family: 'Inter', Arial, sans-serif;
}

/* NAVBAR */
.navbar {
  background: #0a1a33;
  color: white;
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.logo {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 1px;
}

/* NAV LINKS */
.nav-right {
  display: flex;
  gap: 25px;
}

.nav-link {
  color: #dce3ec;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 6px 10px;
  transition: 0.2s;
}

.nav-link:hover {
  color: white;
}

/* ACTIVE PAGE */
.active {
  color: #ffffff !important;
  border-bottom: 2px solid #4da3ff;
  padding-bottom: 4px;
}

/* CART BADGE */
.cart-badge {
  background: #4da3ff;
  color: #0a1a33;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 6px;
}

/* MAIN CONTENT */
main {
  padding: 30px;
  max-width: 1300px;
  margin: 0 auto;
}
</style>
