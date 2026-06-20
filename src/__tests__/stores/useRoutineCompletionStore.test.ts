import { useRoutineCompletionStore } from '@/stores/useRoutineCompletionStore';

beforeEach(() => {
  useRoutineCompletionStore.setState({ completions: {} });
});

describe('useRoutineCompletionStore', () => {
  describe('toggleCompletion', () => {
    it('adds a completion', () => {
      useRoutineCompletionStore.getState().toggleCompletion('r1', '2026-06-20');
      expect(useRoutineCompletionStore.getState().isCompleted('r1', '2026-06-20')).toBe(true);
    });

    it('removes a completion on second toggle', () => {
      const { toggleCompletion } = useRoutineCompletionStore.getState();
      toggleCompletion('r1', '2026-06-20');
      toggleCompletion('r1', '2026-06-20');
      expect(useRoutineCompletionStore.getState().isCompleted('r1', '2026-06-20')).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('returns false for non-existent completion', () => {
      expect(useRoutineCompletionStore.getState().isCompleted('r1', '2026-06-20')).toBe(false);
    });
  });

  describe('getCompletedIds', () => {
    it('returns ids completed on a given date', () => {
      const state = useRoutineCompletionStore.getState();
      state.toggleCompletion('r1', '2026-06-20');
      state.toggleCompletion('r2', '2026-06-20');
      state.toggleCompletion('r3', '2026-06-19');

      const ids = useRoutineCompletionStore.getState().getCompletedIds('2026-06-20');
      expect(ids).toContain('r1');
      expect(ids).toContain('r2');
      expect(ids).not.toContain('r3');
    });
  });

  describe('getStreak', () => {
    it('returns 0 when no completions', () => {
      const streak = useRoutineCompletionStore.getState().getStreak('r1', [1, 3, 5]);
      expect(streak).toBe(0);
    });

    it('counts consecutive completed days', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-20T12:00:00'));

      const state = useRoutineCompletionStore.getState();
      // June 20 is Saturday (6) - not in repeatDays, so skip
      // June 19 is Friday (5) - in repeatDays
      state.toggleCompletion('r1', '2026-06-19');
      // June 18 is Thursday (4) - not in repeatDays
      // June 17 is Wednesday (3) - in repeatDays
      state.toggleCompletion('r1', '2026-06-17');

      const streak = useRoutineCompletionStore.getState().getStreak('r1', [3, 5]);
      expect(streak).toBe(2);

      jest.useRealTimers();
    });
  });

  describe('clearOldCompletions', () => {
    it('removes completions older than retention period', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-20T12:00:00'));

      useRoutineCompletionStore.setState({
        completions: {
          '2026-06-20:r1': Date.now(),
          '2026-05-01:r1': Date.now(),
        },
      });

      useRoutineCompletionStore.getState().clearOldCompletions();

      const { completions } = useRoutineCompletionStore.getState();
      expect(completions['2026-06-20:r1']).toBeTruthy();
      expect(completions['2026-05-01:r1']).toBeUndefined();

      jest.useRealTimers();
    });
  });
});
