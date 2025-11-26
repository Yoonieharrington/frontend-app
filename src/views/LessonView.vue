<template>
  <div v-if="lesson">
    <h1>{{ lesson.subject }}</h1>
    <img :src="" alt="img" class="lesson-image" />
    <p><strong>Location:</strong> {{ lesson.location }}</p>
    <p><strong>Price:</strong> £{{ lesson.price }}</p>
    <p><strong>Available Spaces:</strong> {{ lesson.availableSpaces }}</p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const API = 'https://express-backend-9cfm.onrender.com'
const route = useRoute()
const lesson = ref(null)

async function load() {
  try {
    const res = await fetch(`${API}/lessons`)
    if (!res.ok) throw new Error('Failed')
    const list = await res.json()
    lesson.value = list.find((l) => Number(l.id) === Number(route.params.id))
  } catch (err) {
    console.error(err)
  }
}

onMounted(load)

function imageUrl(name) {
  return `${API}/images/${name}`
}
</script>

<style>
.lesson-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
