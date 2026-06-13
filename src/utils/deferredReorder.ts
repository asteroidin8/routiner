import { InteractionManager } from 'react-native';

/** 드래그 애니메이션이 끝난 뒤 스토어 정렬을 적용해 드롭 끊김을 줄인다. */
export function runAfterDragAnimation(action: () => void): void {
  requestAnimationFrame(() => {
    InteractionManager.runAfterInteractions(action);
  });
}
