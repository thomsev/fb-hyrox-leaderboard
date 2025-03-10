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
              <button type="submit">Submit</button>
              <button type="button" @click="close">Cancel</button>
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
import ExerciseOptions from '@/assets/ExerciseOptions.vue' // adjust the path as needed

export default defineComponent({
  name: 'SubmitExerciseModal',
  components: { ExerciseOptions },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'recordAdded'], // Emit recordAdded event on submission
  setup(props, { emit }) {
    const exercise = ref('')
    const name = ref('')
    const time = ref<number | null>(null)
    const today = new Date().toISOString().slice(0, 10)
    const date = ref(today)

    const close = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      try {
        if (!exercise.value || !name.value || !time.value) {
          alert('Please select an exercise, name, and time.')
          return
        }
        await addDoc(collection(db, 'exerciseTimes'), {
          exercise: exercise.value,
          name: name.value,
          time: time.value,
          date: date.value, // <-- Just store the date string directly
          createdAt: serverTimestamp(), // you can keep or remove this if you want
        })

        alert('Record submitted!')
        // Reset the fields
        exercise.value = ''
        name.value = ''
        time.value = null
        date.value = today

        // Emit an event to notify that a new record was added
        emit('recordAdded')
        close()
      } catch (err) {
        console.error(err)
        alert('Error submitting record.')
      }
    }

    return {
      exercise,
      name,
      time,
      date,
      close,
      handleSubmit,
    }
  },
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #2b2b2b;
  color: #f5f5f5;
  padding: 2rem;
  width: 90%;
  max-width: 50%;
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
}
.buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
button[type='submit'] {
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
  color: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
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
</style>
