<script setup>
import Button from 'primevue/button';
import { usePomodoro } from '@/composables/usePomodoro';
import { useRoute } from 'vue-router';

const route = useRoute();
const { timerDisplay, phaseName, isRunning, waitingForUser, start, stop, resumeTimer, skipInterval } =
  usePomodoro();

const emit = defineEmits(['startPomodoro']);

const handleStart = () => {
  emit('startPomodoro');
  start(route.params.uuid);
};

const handleResume = () => {
  resumeTimer();
};
</script>

<template>
  <div data-test-pomodoro-panel>
    <div class="pomodoro-phase">{{ phaseName }}</div>
    <div data-test-pomodoro-timer class="pomodoro-timer">{{ timerDisplay }}</div>
    <div class="pomodoro-actions">
      <Button
        v-if="waitingForUser"
        data-test-resume-pomodoro
        icon="pi pi-play"
        aria-label="Resume Pomodoro"
        severity="success"
        rounded
        @click="handleResume"
      />
      <Button
        v-if="!isRunning && !waitingForUser"
        data-test-start-pomodoro
        icon="pi pi-play"
        aria-label="Start Pomodoro"
        severity="success"
        rounded
        @click="handleStart"
      />
      <Button
        v-if="isRunning || waitingForUser"
        data-test-stop-pomodoro
        icon="pi pi-stop"
        aria-label="Stop Pomodoro"
        severity="danger"
        rounded
        @click="stop"
      />
      <Button
        v-if="isRunning"
        data-test-skip-pomodoro
        icon="pi pi-fast-forward"
        aria-label="Skip Interval"
        severity="secondary"
        rounded
        @click="skipInterval"
      />
    </div>
  </div>
</template>

<style scoped>
.pomodoro-phase {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.pomodoro-timer {
  text-align: center;
  font-size: 3rem;
  font-variant-numeric: tabular-nums;
  margin-bottom: 1rem;
}
.pomodoro-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
