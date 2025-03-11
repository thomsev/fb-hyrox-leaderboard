<template>
  <template v-for="(exercise, index) in exerciseList" :key="index">
    <option :value="exercise">
      {{ exercise }}
    </option>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  exercises?: string[]
}

const props = defineProps<Props>()

const defaultExercises = [
  'SkiErg (1000m)',
  // Sled Push variations:
  'Sled Push (50m, Men Open 102kg)',
  'Sled Push (50m, Men Pro 202kg)',
  'Sled Push (50m, Women Open 152kg)',
  'Sled Push (50m, Women Pro 100kg)',
  // Sled Pull variations:
  'Sled Pull (50m, Men Open 103kg)',
  'Sled Pull (50m, Men Pro 153kg)',
  'Sled Pull (50m, Women Open 78kg)',
  'Sled Pull (50m, Women Pro 102kg)',
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
  // Optional training variations:
  'Row 500m',
  'Skierg 500m',
]

const exerciseList = computed(() => props.exercises ?? defaultExercises)
</script>
