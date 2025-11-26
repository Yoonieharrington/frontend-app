import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CheckoutView from '../views/CheckoutView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/checkout', name: 'checkout', component: CheckoutView }
];

const router = createRouter({
  history: createWebHashHistory(), // <-- use hash history for GitHub Pages
  routes,
});

export default router;
