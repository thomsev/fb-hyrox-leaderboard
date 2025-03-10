<!-- src/App.vue -->
<template>
  <div id="app">
    <HeaderNav />

    <!-- MODAL SHOWN ONLY WHEN route.name === 'exercise-modal' -->
    <Modal :visible="isModalOpen" @close="closeModal">
      <h2>Select Exercise</h2>
      <p>Your form or content here.</p>
      <button @click="closeModal">Close</button>
    </Modal>

    <main class="main-container">
      <!-- The main router view with your pages -->
      <RouterView />
    </main>

    <FooterBar />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '@/components/HeaderNav.vue'
import FooterBar from '@/components/FooterBar.vue'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  name: 'App',
  components: {
    HeaderNav,
    FooterBar,
    Modal,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // Check if route name is "exercise-modal"
    const isModalOpen = computed(() => route.name === 'exercise-modal')

    // Close by navigating back to '/'
    const closeModal = () => {
      router.push('/')
    }

    return {
      isModalOpen,
      closeModal,
    }
  },
})
</script>

<style scoped>
.main-container {
  min-height: 80vh;
  padding: 1rem;
}
</style>
