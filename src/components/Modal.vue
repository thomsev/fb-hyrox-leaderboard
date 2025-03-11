<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="visible" @click="close">
      <transition name="slide-down">
        <div class="modal-content" v-if="visible" @click.stop>
          <h2>Submit Exercise</h2>

          <form @submit.prevent="handleSubmit">
            <!-- EXERCISE SELECT -->
            <label>Exercise</label>
            <select v-model="exercise">
              <option disabled value="">-- Choose an exercise --</option>
              <!-- Use our ExerciseOptions component here -->
              <ExerciseOptions />
            </select>

            <!-- NAME INPUT -->
            <label>Name</label>
            <input type="text" v-model="name" placeholder="Your name" />

            <!-- TIME INPUT (seconds) -->
            <label>Time (seconds)</label>
            <input type="number" v-model.number="time" min="1" placeholder="e.g. 360" />

            <!-- DATE INPUT -->
            <label>Date</label>
            <input type="date" v-model="date" />

            <div class="buttons">
              <button type="submit" :disabled="isSubmitting">Submit</button>
              <button type="button" @click="close" :disabled="isSubmitting">Cancel</button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/services/firebase'
import ExerciseOptions from '@/assets/ExerciseOptions.vue'

export default defineComponent({
  name: 'SubmitExerciseModal',
  components: { ExerciseOptions },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'recordAdded'],
  setup(props, { emit }) {
    const exercise = ref('')
    const name = ref('')
    const time = ref<number | null>(null)
    const today = new Date().toISOString().slice(0, 10)
    const date = ref(today)

    // Spam protection & submission tracking
    const submissionCount = ref(0)
    const spamTimeout = ref(false)
    const isSubmitting = ref(false)
    let submissionTimer: ReturnType<typeof setTimeout> | null = null

    const resetSubmissionCount = () => {
      submissionCount.value = 0
      if (submissionTimer) {
        clearTimeout(submissionTimer)
        submissionTimer = null
      }
    }

    const close = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      // Prevent submission if spam timeout is active
      if (spamTimeout.value) {
        alert('Too many submissions. Please wait a moment before trying again.')
        return
      }

      // If 3 or more submissions occur within 10 seconds, trigger spam protection
      if (submissionCount.value >= 3) {
        spamTimeout.value = true
        alert('Too many submissions. Please wait 30 seconds before trying again.')
        setTimeout(() => {
          spamTimeout.value = false
          submissionCount.value = 0
        }, 30000)
        return
      }

      // Validate inputs
      if (!exercise.value || !name.value || !time.value || time.value <= 0) {
        alert('Please select an exercise, enter your name, and provide a valid time.')
        return
      }

      submissionCount.value++
      // Reset the submission count after 10 seconds if no further submissions occur
      if (submissionTimer) clearTimeout(submissionTimer)
      submissionTimer = setTimeout(resetSubmissionCount, 10000)

      isSubmitting.value = true
      try {
        await addDoc(collection(db, 'exerciseTimes'), {
          exercise: exercise.value,
          name: name.value,
          time: time.value,
          date: date.value, // storing as a string
          createdAt: serverTimestamp(),
        })
        alert('Record submitted!')
        // Reset fields
        exercise.value = ''
        name.value = ''
        time.value = null
        date.value = today

        emit('recordAdded')
        close()
      } catch (err) {
        console.error(err)
        alert('Error submitting record.')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      exercise,
      name,
      time,
      date,
      close,
      handleSubmit,
      isSubmitting,
    }
  },
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: #2b2b2b;
  color: #f5f5f5;
  padding: 2rem;
  width: 90%;
  max-width: 30rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
}

select,
input[type='text'],
input[type='number'],
input[type='date'] {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #999;
  background: #fff;
  color: #333;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

button[type='submit'],
button[type='button'] {
  background-color: #3aae2a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

button[type='button'] {
  background: #666;
}

/* transitions for fade & slide-down */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.2s;
}
.slide-down-enter {
  transform: translateY(-20px);
}
.slide-down-leave-to {
  transform: translateY(-20px);
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .modal-content {
    padding: 1rem;
    width: 95%;
    max-width: 95%;
  }
  select,
  input[type='text'],
  input[type='number'],
  input[type='date'],
  button {
    font-size: 0.9rem;
  }
  .buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
