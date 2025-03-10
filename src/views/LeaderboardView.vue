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

    <!-- Table -->
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { db } from '@/services/firebase'
import { collection, getDocs, orderBy, query, where, Timestamp } from 'firebase/firestore'
import { VueGoodTable } from 'vue-good-table-next'
import ExerciseOptions from '@/assets/ExerciseOptions.vue' // adjust the path as needed

// Firestore doc structure (adjust as needed)
interface ExerciseTime {
  id: string
  exercise: string
  name: string
  time: number
  createdAt?: Timestamp
}

export default defineComponent({
  name: 'LeaderboardView',
  components: { VueGoodTable, ExerciseOptions },
  setup() {
    // Official exercise list for the dropdown.
    const exercises = ref<string[]>([
      'SkiErg (1000m)',
      // Sled Push variations:
      'Sled Push (50m, Men Open 75kg)',
      'Sled Push (50m, Men Pro 125kg)',
      'Sled Push (50m, Women Open 50kg)',
      'Sled Push (50m, Women Pro 100kg)',
      // Sled Pull variations:
      'Sled Pull (50m, Men Open 50kg)',
      'Sled Pull (50m, Men Pro 75kg)',
      'Sled Pull (50m, Women Open 37.5kg)',
      'Sled Pull (50m, Women Pro 50kg)',
      // Other exercises:
      'Burpee Broad Jumps (80m, no weight)',
      'Row (1000m)',
      // Farmer’s Carry variations:
      'Farmer’s Carry (200m, Men Open 2x24kg)',
      'Farmer’s Carry (200m, Men Pro 2x32kg)',
      'Farmer’s Carry (200m, Women Open 2x16kg)',
      'Farmer’s Carry (200m, Women Pro 2x24kg)',
      // Sandbag Lunges variations:
      'Sandbag Lunges (100m, Men Open 20kg)',
      'Sandbag Lunges (100m, Men Pro 30kg)',
      'Sandbag Lunges (100m, Women Open 10kg)',
      'Sandbag Lunges (100m, Women Pro 20kg)',
      // Wall Balls variations:
      'Wall Balls (75 Open)',
      'Wall Balls (100 Pro)',
      // Optionally keep your “training” variations:
      'Row 500m',
      'Skierg 500m',
    ])

    const selectedExercise = ref<string>('') // default is blank
    const exerciseTimes = ref<ExerciseTime[]>([])

    // columns for vue-good-table
    const columns = [
      { label: 'Name', field: 'name' },
      { label: 'Exercise', field: 'exercise' },
      { label: 'Time (s)', field: 'time' },
      {
        label: 'Date',
        field: 'date', // use your plain string "date" field
      },
    ]

    const fetchTimes = async () => {
      try {
        if (!selectedExercise.value) {
          exerciseTimes.value = []
          return
        }
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
        console.log('Fetched times:', data)
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
.leaderboard-view {
  max-width: 90%;
  margin: 2rem auto;
  background: #2b2b2b;
  padding: 1rem;
  border-radius: 8px;
  color: #f5f5f5;
}

.leaderboard-view h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #3aae2a;
}

.filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

#exerciseSelect {
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid #999;
  background: #f9f9f9;
  color: #333;
}

/* Minor vue-good-table styling tweaks */
.vgt-table {
  background: #1e1e1e;
  border: 1px solid #444;
}
.vgt-table-header {
  background: #333;
  color: #fff;
  border-bottom: 1px solid #444;
}
.vgt-table-header th {
  padding: 0.75rem;
}
.vgt-row {
  border-bottom: 1px solid #444;
}
.vgt-row td {
  padding: 0.75rem;
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
</style>
