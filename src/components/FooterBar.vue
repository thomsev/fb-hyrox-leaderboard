<!-- src/components/FooterBar.vue -->
<template>
  <footer class="footer-bar">
    <p>© 2025 HYROX Gym Leaderboard - Built with Vue 3</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterBar',
})
</script>

<style scoped>
.footer-bar {
  background: #2b2b2b; /* match the header's dark background */
  padding: 1rem;
  text-align: center;
  color: #f5f5f5; /* light text */
  margin-top: 2rem;
  border-top: 1px solid #3a3a3a;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.footer-bar p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}
</style>
