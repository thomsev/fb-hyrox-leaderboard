<!-- src/components/HeaderNav.vue -->
<template>
  <header class="header-nav">
    <nav>
      <!-- Left half: Logo (links to home) -->
      <div class="left-half">
        <RouterLink to="/">
          <img src="@/assets/Crossfit-Hallen-Logo.webp" alt="Your Logo" class="nav-logo" />
        </RouterLink>
      </div>

      <!-- Right half: "Add Time" button -->
      <div class="right-half">
        <button class="add-time-button" @click="showModal = true">Add Time</button>
      </div>
    </nav>

    <!-- The modal lives here, toggled by showModal -->
    <SubmitExerciseModal
      :visible="showModal"
      @close="showModal = false"
      @recordAdded="handleRecordAdded"
    />
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SubmitExerciseModal from '@/components/Modal.vue'
// ^ Adjust path if needed

export default defineComponent({
  name: 'HeaderNav',
  components: { SubmitExerciseModal },
  setup() {
    const showModal = ref(false)

    const handleRecordAdded = () => {
      // Optionally refresh your leaderboard or do something else here
      console.log('A new record was added!')
    }

    return {
      showModal,
      handleRecordAdded,
    }
  },
})
</script>

<style scoped>
.header-nav {
  background: #2b2b2b; /* dark background */
  padding: 0.75rem 1rem;
}

/* The nav is a flex container split into two halves */
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Left and right halves each take 50% of horizontal space */
.left-half,
.right-half {
  display: flex;
  align-items: center;
  width: 50%;
}

/* Logo on the left, aligned to start */
.left-half {
  justify-content: flex-start;
}

/* Button on the right, aligned to end */
.right-half {
  justify-content: flex-end;
}

/* Logo styling */
.nav-logo {
  height: 60px; /* adjust as needed */
  max-width: 100%;
}

/* "Add Time" button styling */
.add-time-button {
  background-color: #3aae2a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.add-time-button:hover {
  background-color: #60cca3;
}

/* Responsive: stack vertically on smaller screens */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
  }
  .left-half,
  .right-half {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .nav-logo {
    height: 50px;
  }
}
</style>
