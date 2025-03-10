<template>
  <div class="leaderboard-view">
    <h1>{{ selectedExercise ? selectedExercise : 'FB-HYROX Leaderboard' }}</h1>

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
        :rows="exerciseTimes"
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
import { defineComponent, ref } from 'vue'
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
      'Sled Push (50m, Men Open 75kg)',
      'Sled Push (50m, Men Pro 125kg)',
      'Sled Push (50m, Women Open 50kg)',
      'Sled Push (50m, Women Pro 100kg)',
      'Sled Pull (50m, Men Open 50kg)',
      'Sled Pull (50m, Men Pro 75kg)',
      'Sled Pull (50m, Women Open 37.5kg)',
      'Sled Pull (50m, Women Pro 50kg)',
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
      { label: 'Time (s)', field: 'time' },
      { label: 'Date', field: 'date' },
    ]

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

    return {
      exercises,
      selectedExercise,
      exerciseTimes,
      columns,
      fetchTimes,
    }
  },
})
</script>

<style scoped>
/* Container styling */
.leaderboard-view {
  /* Make container full width, or set a larger max-width if desired */
  width: 100%;
  max-width: 800px; /* Increase as needed */
  margin: 2rem auto;
  background: #2b2b2b;
  padding: 1.5rem;
  border-radius: 8px;
  color: #f5f5f5;
}

/* Title styling */
.leaderboard-view h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #3aae2a;
}

/* Filters */
.filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Select box */
#exerciseSelect {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #999;
  background: #f9f9f9;
  color: #333;
}

/* Table wrapper: allow horizontal scroll if needed */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

/* Minor vue-good-table styling tweaks */
.vgt-table {
  background: #1e1e1e;
  border: 1px solid #444;
  font-size: 1rem; /* Larger base font */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .leaderboard-view {
    /* On tablets and smaller screens, remove max-width so it can be full width */
    max-width: 100%;
    margin: 1rem auto;
    padding: 1rem;
    border-radius: 0;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .vgt-table {
    font-size: 0.95rem; /* Slightly smaller if you need more space */
  }
  .vgt-table-header th,
  .vgt-row td {
    padding: 0.5rem;
  }
}
</style>
