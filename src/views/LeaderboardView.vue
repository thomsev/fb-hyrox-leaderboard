<template>
  <div class="leaderboard-view">
    <h1>{{ selectedExercise ? selectedExercise : 'FB-HYROX Leaderboard' }}</h1>
    <!-- Countdown Timer (Days Only) -->
    <div class="countdown">
      <h2>Countdown to Hyrox Oslo</h2>
      <p class="days">{{ countdown.days }} Days</p>
    </div>

    <!-- Exercise Dropdown -->
    <div class="filters">
      <label for="exerciseSelect">Select Exercise:</label>
      <select id="exerciseSelect" v-model="selectedExercise" @change="fetchTimes">
        <option disabled value="">-- Choose an exercise --</option>
        <ExerciseOptions :exercises="exercises" />
      </select>
    </div>

    <!-- Table Wrapper -->
    <div class="table-wrapper">
      <vue-good-table
        :columns="columns"
        :rows="formattedExerciseTimes"
        :search-options="{ enabled: true }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          perPage: 5,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUnmounted } from 'vue'
import { db } from '@/services/firebase'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { VueGoodTable } from 'vue-good-table-next'
import ExerciseOptions from '@/assets/ExerciseOptions.vue'

interface ExerciseTime {
  id: string
  exercise: string
  name: string
  time: number
  date?: string
}

export default defineComponent({
  name: 'LeaderboardView',
  components: { VueGoodTable, ExerciseOptions },
  setup() {
    const exercises = ref<string[]>([
      'SkiErg (1000m)',
      'Sled Push (50m, Men Open 102kg)',
      'Sled Push (50m, Men Pro 202kg)',
      'Sled Push (50m, Women Open 152kg)',
      'Sled Push (50m, Women Pro 100kg)',
      'Sled Pull (50m, Men Open 103kg)',
      'Sled Pull (50m, Men Pro 153kg)',
      'Sled Pull (50m, Women Open 78kg)',
      'Sled Pull (50m, Women Pro 102kg)',
      'Burpee Broad Jumps (80m, no weight)',
      'Row (1000m)',
      'Farmer’s Carry (200m, Men Open 2x24kg)',
      'Farmer’s Carry (200m, Men Pro 2x32kg)',
      'Farmer’s Carry (200m, Women Open 2x16kg)',
      'Farmer’s Carry (200m, Women Pro 2x24kg)',
      'Sandbag Lunges (100m, Men Open 20kg)',
      'Sandbag Lunges (100m, Men Pro 30kg)',
      'Sandbag Lunges (100m, Women Open 10kg)',
      'Sandbag Lunges (100m, Women Pro 20kg)',
      'Wall Balls (75 Open)',
      'Wall Balls (100 Pro)',
      'Row 500m',
      'Skierg 500m',
    ])

    const selectedExercise = ref<string>('')
    const exerciseTimes = ref<ExerciseTime[]>([])

    const columns = [
      { label: 'Name', field: 'name' },
      { label: 'Exercise', field: 'exercise' },
      { label: 'Time', field: 'time' },
      { label: 'Date', field: 'date' },
    ]

    // Format time from seconds to "mm:ss"
    const formattedExerciseTimes = computed(() =>
      exerciseTimes.value.map((item) => {
        const minutes = Math.floor(item.time / 60)
        const seconds = item.time % 60
        return {
          ...item,
          time: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
        }
      }),
    )

    const fetchTimes = async () => {
      if (!selectedExercise.value) {
        exerciseTimes.value = []
        return
      }
      try {
        const q = query(
          collection(db, 'exerciseTimes'),
          where('exercise', '==', selectedExercise.value),
          orderBy('time', 'asc'),
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ExerciseTime, 'id'>),
        }))
        exerciseTimes.value = data
      } catch (err) {
        console.error('Error fetching exercise times:', err)
      }
    }

    // Countdown Timer to Hyrox Oslo on 26 Sept 2025 (Days Only)
    const countdown = ref({ days: 0 })
    const targetDate = new Date('2025-09-26T00:00:00')
    const updateCountdown = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) {
        countdown.value = { days: 0 }
        clearInterval(intervalId)
        return
      }
      countdown.value = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      }
    }
    const intervalId = setInterval(updateCountdown, 1000)
    updateCountdown()
    onUnmounted(() => {
      clearInterval(intervalId)
    })

    return {
      exercises,
      selectedExercise,
      exerciseTimes,
      columns,
      fetchTimes,
      formattedExerciseTimes,
      countdown,
    }
  },
})
</script>

<style scoped>
/* Reset margins/padding so the viewport height is consistent */
html,
body {
  margin: 0;
  padding: 0;
  /* Not strictly required, but if you want the entire page to be 100dvh as well: */
  height: 100dvh;
}

/* Leaderboard Container */
.leaderboard-view {
  /* Dynamically match viewport height and allow vertical scroll */
  min-height: 100dvh;
  overflow-y: auto;

  /* Keep your existing styling */
  max-width: 800px;
  margin: 2rem auto; /* You can remove or adjust this if you don’t want extra space on top/bottom */
  background: #2b2b2b;
  padding: 1.5rem;
  border-radius: 8px;
  color: #f5f5f5;
}

/* Countdown Timer Styling */
.countdown {
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #09d375, #49e90a);
  border-radius: 12px;
  color: #2b2828;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.countdown h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.countdown .days {
  font-size: 3rem;
  font-weight: bold;
  animation: pulse 2s infinite;
}

/* Pulse Animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Title Styling */
.leaderboard-view h1 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  color: #3aae2a;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  animation: popIn 0.8s ease-out;
  transition:
    transform 0.3s ease,
    text-shadow 0.3s ease;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.leaderboard-view h1:hover {
  transform: scale(1.05);
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

/* Filters Container */
.filters {
  display: flex;
  flex-wrap: wrap; /* Allows wrapping on narrow screens */
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #09d375, #49e90a);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* "Select Exercise" Label */
.filters label {
  font-weight: bold;
  color: #2b2828;
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* Styled Select Box */
#exerciseSelect {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #2b2828; /* Dark background for contrast */
  color: #f5f5f5; /* Light text color */
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  max-width: 100%; /* Prevents overflow on narrow screens */
}

#exerciseSelect:hover {
  background: #333;
}

#exerciseSelect:focus {
  outline: none;
  border: 2px solid #2b2b2b;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

/* Table Wrapper */
.table-wrapper {
  width: 100%;
  overflow-x: auto; /* Horizontal scroll if table is wide */
}

/* Vue Good Table Tweaks */
.vgt-table {
  background: #1e1e1e;
  border: 1px solid #444;
  font-size: 1rem;
}
.vgt-table-header {
  background: #333;
  color: #fff;
  border-bottom: 1px solid #444;
}
.vgt-table-header th {
  padding: 0.75rem 1rem;
}
.vgt-row {
  border-bottom: 1px solid #444;
}
.vgt-row td {
  padding: 0.75rem 1rem;
  color: #f5f5f5;
}
.vgt-row:hover {
  background: #2a2a2a;
}
.vgt-pagination {
  background: #333;
  color: #fff;
  padding: 0.5rem;
}
.vgt-global-search__input {
  background: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .vgt-table {
    font-size: 0.95rem;
  }
  .vgt-table-header th,
  .vgt-row td {
    padding: 0.5rem;
  }
  #exerciseSelect {
    width: 100%;
  }
}
</style>
