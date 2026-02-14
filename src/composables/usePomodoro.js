import { ref, computed } from 'vue';
import { createGlobalState, useIntervalFn } from '@vueuse/shared';
import { useNodeStore } from '@/stores/NodeStore';

const MINUTE = 60;
const WORK_DURATION = 25 * MINUTE;
const SHORT_BREAK_DURATION = 5 * MINUTE;
const LONG_BREAK_DURATION = 15 * MINUTE;
const INTERVALS_BEFORE_LONG_BREAK = 4;

export const usePomodoro = createGlobalState(() => {
  const remainingSeconds = ref(WORK_DURATION);
  const phase = ref('work');
  const completedIntervals = ref(0);
  const activeNodeUuid = ref(null);

  const handlePhaseComplete = () => {
    if (phase.value === 'work') {
      completedIntervals.value++;

      if (activeNodeUuid.value) {
        const { incrementPomodoro } = useNodeStore();
        incrementPomodoro(activeNodeUuid.value);
      }

      if (completedIntervals.value % INTERVALS_BEFORE_LONG_BREAK === 0) {
        phase.value = 'long-break';
        remainingSeconds.value = LONG_BREAK_DURATION;
      } else {
        phase.value = 'short-break';
        remainingSeconds.value = SHORT_BREAK_DURATION;
      }
    } else {
      phase.value = 'work';
      remainingSeconds.value = WORK_DURATION;
    }
  };

  const waitingForUser = ref(false);

  const {
    isActive: isRunning,
    pause,
    resume,
  } = useIntervalFn(
    () => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
      } else {
        handlePhaseComplete();
        pause();
        waitingForUser.value = true;
      }
    },
    1000,
    { immediate: false },
  );

  const timerDisplay = computed(() => {
    const min = Math.floor(remainingSeconds.value / 60);
    const sec = remainingSeconds.value % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  });

  const phaseName = computed(() => {
    const names = {
      work: 'Work',
      'short-break': 'Short Break',
      'long-break': 'Long Break',
    };
    return names[phase.value] || '';
  });

  const start = (nodeUuid = null) => {
    if (isRunning.value) return;
    activeNodeUuid.value = nodeUuid;
    waitingForUser.value = false;
    resume();
  };

  const resumeTimer = () => {
    if (isRunning.value) return;
    waitingForUser.value = false;
    resume();
  };

  const stop = () => {
    pause();
    remainingSeconds.value = WORK_DURATION;
    phase.value = 'work';
    completedIntervals.value = 0;
    activeNodeUuid.value = null;
    waitingForUser.value = false;
  };

  const skipInterval = () => {
    if (!isRunning.value) return;
    remainingSeconds.value = 0;
  };

  return {
    remainingSeconds,
    phase,
    completedIntervals,
    isRunning,
    waitingForUser,
    timerDisplay,
    phaseName,
    activeNodeUuid,
    start,
    stop,
    resumeTimer,
    skipInterval,
  };
});
