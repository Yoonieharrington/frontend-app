<script setup>
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "../stores/cartStore";

const cartStore = useCartStore();

// LESSONS DATA
const lessons = ref([]);

// SEARCH + SORT
const searchQuery = ref("");
const sortOption   = ref("");

// BACKEND URL (your Render backend)
const API_URL = "https://express-backend-9cfm.onrender.com/lessons";

async function loadLessons() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    lessons.value = data;
    console.log("Loaded lessons:", data);
  } catch (err) {
    console.error("Failed to load lessons:", err);
  }
}

onMounted(() => {
  loadLessons();
});

// FILTER + SORT
const filteredLessons = computed(() => {
  let list = [...lessons.value];

  // SEARCH
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((l) =>
      [l.subject, l.location, l.price, l.availableSpaces]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  // SORTING
  const s = sortOption.value;
  const compare = (a, b, field) =>
    String(a[field]).localeCompare(String(b[field]));

  if (s === "subject-asc") list.sort((a, b) => compare(a, b, "subject"));
  if (s === "subject-desc") list.sort((a, b) => compare(b, a, "subject"));

  if (s === "location-asc") list.sort((a, b) => compare(a, b, "location"));
  if (s === "location-desc") list.sort((a, b) => compare(b, a, "location"));

  if (s === "price-asc")
    list.sort((a, b) => Number(a.price) - Number(b.price));
  if (s === "price-desc")
    list.sort((a, b) => Number(b.price) - Number(a.price));

  if (s === "spaces-asc")
    list.sort((a, b) => Number(a.availableSpaces) - Number(b.availableSpaces));
  if (s === "spaces-desc")
    list.sort((a, b) => Number(b.availableSpaces) - Number(a.availableSpaces));

  return list;
});
</script>

<template>
  <div class="page">
    <h1 class="title">Available Lessons</h1>

    <!-- SEARCH + SORT -->
    <div class="controls">
      <input 
        v-model="searchQuery"
        placeholder="Search lessons..."
        class="input"
      />

      <select v-model="sortOption" class="input">
        <option value="">Sort By...</option>

        <option value="subject-asc">Subject A → Z</option>
        <option value="subject-desc">Subject Z → A</option>

        <option value="location-asc">Location A → Z</option>
        <option value="location-desc">Location Z → A</option>

        <option value="price-asc">Price Low → High</option>
        <option value="price-desc">Price High → Low</option>

        <option value="spaces-asc">Spaces Low → High</option>
        <option value="spaces-desc">Spaces High → Low</option>
      </select>
    </div>

    <!-- LESSON GRID -->
    <div class="grid">
      <div 
        v-for="lesson in filteredLessons" 
        :key="lesson._id"
        class="card"
      >
        <img 
          :src="'/images/' + (lesson.image || 'placeholder.png')" 
          class="lesson-img"
          @error="(e) => e.target.src = '/images/placeholder.png'"
        />

        <h2 class="lesson-title">{{ lesson.subject }}</h2>
        <p class="info">📍 {{ lesson.location }}</p>
        <p class="info">💰 £{{ lesson.price }}</p>
        <p class="info">📦 {{ lesson.availableSpaces }} spaces</p>

        <button 
          class="btn"
          :disabled="lesson.availableSpaces <= 0"
          @click="cartStore.addToCart(lesson)"
        >
          {{ lesson.availableSpaces > 0 ? "Add to Cart" : "Full" }}
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* PAGE */
.page {
  max-width: 1100px;
  margin: auto;
  padding: 30px;
  color: #0a1a33;
}

.title {
  text-align: center;
  font-size: 2.3rem;
  font-weight: 700;
  margin-bottom: 30px;
}

/* SEARCH + SORT */
.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}

.input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 1rem;
  flex: 1;
  transition: 0.25s;
}

.input:focus {
  border-color: #0a1a33;
  box-shadow: 0 0 0 3px rgba(10, 26, 51, 0.15);
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* CARD */
.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
}

.lesson-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

.lesson-title {
  font-size: 1.4rem;
  margin: 6px 0;
  font-weight: 600;
}

.info {
  margin: 4px 0;
  color: #334155;
}

/* BUTTON */
.btn {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: #0a1a33;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.25s;
}

.btn:hover {
  background: #14284c;
}

.btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
