<!-- src/components/HeaderNav.vue -->
<template>
  <header class="header-nav">
    <nav>
      <RouterLink to="/">
        <img src="@/assets/Crossfit-Hallen-Logo.webp" alt="Your Logo" class="nav-logo" />
      </RouterLink>
      <RouterLink to="/">Leaderboard</RouterLink>
      <RouterLink to="/exercise-modal">Add Time</RouterLink>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderNav',
})
</script>

<style scoped>
.header-nav {
  background: #2b2b2b; /* dark background */
  padding: 0.75rem 1rem;
}

nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
}

nav img {
  margin-left: 2rem;
  padding: 1rem;
}

nav a {
  text-decoration: none;
  color: #3aae2a; /* Vue green accent for links */
  font-weight: 600;
  transition: color 0.2s;
  font-size: 2rem;
}
nav a:hover {
  color: #60cca3; /* slightly lighter green on hover */
}

nav a.router-link-active {
  text-decoration: underline;
}
</style>
