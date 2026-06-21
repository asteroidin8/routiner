import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/AppIcon';
import { AppText } from '@/components/AppText';
import { Coachmark } from '@/components/Coachmark';
import { Divider } from '@/components/Divider';
import { EmptyState } from '@/components/EmptyState';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { RoutineItem } from '@/components/RoutineItem';
import { RoutineModal } from '@/components/RoutineModal';
import { SwipeActions } from '@/components/SwipeActions';
import { UndoSnackbar } from '@/components/UndoSnackbar';
import { radius, spacing } from '@/constants/spacing';
import { DAY_LABELS } from '@/constants/statsLabels';
import { useTabScrollToTop } from '@/contexts/TabNavigationContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { type Routine, type Weekday, useRoutineStore } from '@/stores/useRoutineStore';
import { useRoutineCompletionStore } from '@/stores/useRoutineCompletionStore';
import { runAfterDragAnimation } from '@/utils/deferredReorder';

const TAB_INDEX = 1 as const;

const DAY_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

function getTodayDay(): Weekday {
  return new Date().getDay() as Weekday;
}

function EditBottomBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDelete,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDelete: () => void;
}) {
  const c = useThemeColors();
  const allSelected = selectedCount === totalCount && totalCount > 0;
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.screen,
        paddingVertical: spacing.md,
        paddingBottom: spacing.section,
        backgroundColor: c.surfaceSubtle,
        borderTopWidth: 1,
        borderTopColor: c.border,
      }}
    >
      <Pressable
        onPress={onSelectAll}
        hitSlop={8}
        accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}
      >
        <AppIcon name={allSelected ? 'CheckSquare' : 'Square'} size={18} color={c.ink} />
        <AppText variant="body">{allSelected ? '선택 해제' : '전체 선택'}</AppText>
      </Pressable>

      <AppText variant="caption" tone="tertiary">{selectedCount}개 선택됨</AppText>

      <Pressable
        onPress={onDelete}
        disabled={selectedCount === 0}
        hitSlop={8}
        accessibilityRole="button"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          opacity: selectedCount === 0 ? 0.4 : 1,
        }}
      >
        <AppIcon name="Trash2" size={16} color={c.danger} />
        <AppText variant="body" style={{ color: c.danger }}>삭제</AppText>
      </Pressable>
    </View>
  );
}

export default function RoutineScreen() {
  const c = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop(TAB_INDEX, scrollRef);

  const { routines, addRoutine, updateRoutine, removeRoutine, removeRoutines, reorderRoutines } = useRoutineStore();
  const { toggleCompletion, isCompleted } = useRoutineCompletionStore();
  const { seenHints, markHintSeen } = useSettingsStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Routine | null>(null);
  const [undoTarget, setUndoTarget] = useState<Routine | null>(null);
  const [otherExpanded, setOtherExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const today = getTodayDay();
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRoutines = routines
    .filter((r) => r.repeatDays.includes(today))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const otherRoutines = routines
    .filter((r) => !r.repeatDays.includes(today))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const allTodayComplete =
    todayRoutines.length > 0 && todayRoutines.every((r) => isCompleted(r.id, todayStr));

  const showSwipeHint = !seenHints.swipeActions && routines.length > 0;

  function enterEditMode() {
    setEditMode(true);
    setSelectedIds(new Set());
  }

  function exitEditMode() {
    setEditMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectAll() {
    const allIds = routines.map((r) => r.id);
    if (selectedIds.size === allIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }

  function handleBulkDelete() {
    const count = selectedIds.size;
    if (count === 0) return;
    Alert.alert(
      `${count}개 삭제`,
      `선택한 ${count}개의 루틴을 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            removeRoutines(Array.from(selectedIds));
            exitEditMode();
          },
        },
      ],
    );
  }

  function openAdd() {
    setEditTarget(null);
    setModalVisible(true);
  }

  function openEdit(routine: Routine) {
    setEditTarget(routine);
    setModalVisible(true);
  }

  function handleSave(data: { name: string; repeatDays: Weekday[]; reminderTime: string | null }) {
    if (editTarget) {
      updateRoutine(editTarget.id, data);
    } else {
      addRoutine({
        id: String(Date.now()),
        createdAt: Date.now(),
        order: routines.length,
        ...data,
      });
    }
    setModalVisible(false);
  }

  function toggleCompleted(id: string) {
    toggleCompletion(id, todayStr);
  }

  function handleTodayReorder({ data }: { data: Routine[] }) {
    runAfterDragAnimation(() => {
      reorderRoutines([...data, ...otherRoutines].map((r, i) => ({ ...r, order: i })));
    });
  }

  function handleOtherReorder({ data }: { data: Routine[] }) {
    runAfterDragAnimation(() => {
      reorderRoutines([...todayRoutines, ...data].map((r, i) => ({ ...r, order: i })));
    });
  }

  function renderSelectableItem(routine: Routine) {
    const selected = selectedIds.has(routine.id);
    return (
      <Pressable
        key={routine.id}
        onPress={() => toggleSelection(routine.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.screen,
          gap: spacing.item,
          backgroundColor: selected ? `${c.primary}15` : 'transparent',
        }}
      >
        <AppIcon
          name={selected ? 'CheckSquare' : 'Square'}
          size={20}
          color={selected ? c.primary : c.inkDisabled}
        />
        <View style={{ flex: 1 }}>
          <AppText variant="body">{routine.name}</AppText>
          <AppText variant="caption" tone="disabled">
            {routine.repeatDays.map((d) => DAY_SHORT[d]).join('·')}
          </AppText>
        </View>
      </Pressable>
    );
  }

  function renderRoutineItem(onToggle: (id: string) => void, allowComplete: boolean) {
    return function RoutineListRow({ item, drag }: RenderItemParams<Routine>) {
      const completed = isCompleted(item.id, todayStr);

      return (
        <ScaleDecorator activeScale={1.02}>
          <SwipeActions
            onDelete={() => {
              setUndoTarget(item);
              removeRoutine(item.id);
            }}
            onComplete={
              allowComplete
                ? () => {
                    if (!completed) toggleCompleted(item.id);
                  }
                : undefined
            }
          >
            <View>
              <RoutineItem
                routine={item}
                isCompleted={completed}
                onToggle={() => onToggle(item.id)}
                onLongPress={drag}
                onPress={() => openEdit(item)}
              />
              <Divider />
            </View>
          </SwipeActions>
        </ScaleDecorator>
      );
    };
  }

  const isEmpty = routines.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.surface }} edges={['top']}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.screen,
          paddingTop: spacing.card,
          paddingBottom: spacing.sm,
        }}
      >
        <AppText variant="title">루틴</AppText>
        {!isEmpty && (
          <Pressable onPress={editMode ? exitEditMode : enterEditMode} hitSlop={8} accessibilityRole="button">
            <AppText variant="body" tone={editMode ? 'primary' : 'tertiary'} style={{ fontWeight: '600' }}>
              {editMode ? '완료' : '편집'}
            </AppText>
          </Pressable>
        )}
      </View>

      {isEmpty ? (
        <EmptyState
          message="되고 싶은 내 모습을 추가해보세요"
          variant="routine"
          actionLabel="루틴 추가하기"
          onAction={openAdd}
        />
      ) : editMode ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {todayRoutines.length > 0 && (
            <>
              <View style={{ marginTop: spacing.card, marginBottom: spacing.xs, paddingHorizontal: spacing.screen }}>
                <AppText variant="caption" tone="tertiary">
                  오늘 · {DAY_LABELS[today]}요일
                </AppText>
              </View>
              {todayRoutines.map(renderSelectableItem)}
              <Divider />
            </>
          )}
          {otherRoutines.length > 0 && (
            <>
              <View style={{ marginTop: spacing.card, marginBottom: spacing.xs, paddingHorizontal: spacing.screen }}>
                <AppText variant="caption" tone="disabled">
                  그 외 {otherRoutines.length}
                </AppText>
              </View>
              {otherRoutines.map(renderSelectableItem)}
            </>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {allTodayComplete && (
            <View
              style={{
                marginHorizontal: spacing.screen,
                marginTop: spacing.sm,
                marginBottom: spacing.xs,
                paddingHorizontal: spacing.item,
                paddingVertical: spacing.md,
                borderRadius: radius.md,
                backgroundColor: c.surfaceSubtle,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <AppText variant="body" style={{ fontWeight: '700' }}>
                오늘 잔디 심기 완료!
              </AppText>
              <AppText variant="caption" tone="tertiary" style={{ marginTop: 2 }}>
                내일도 잔디를 심어보세요
              </AppText>
            </View>
          )}

          {todayRoutines.length > 0 && (() => {
            const completedCount = todayRoutines.filter((r) => isCompleted(r.id, todayStr)).length;
            return (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.card, marginBottom: spacing.xs, paddingHorizontal: spacing.screen }}>
                <AppText variant="caption" tone="tertiary">
                  오늘 · {DAY_LABELS[today]}요일
                </AppText>
                <AppText variant="caption" tone={completedCount === todayRoutines.length ? 'primary' : 'tertiary'} style={{ fontWeight: '600' }}>
                  {completedCount}/{todayRoutines.length}
                </AppText>
              </View>
              <View style={{ paddingHorizontal: spacing.screen }}>
                <DraggableFlatList
                  data={todayRoutines}
                  keyExtractor={(r) => r.id}
                  onDragEnd={handleTodayReorder}
                  renderItem={renderRoutineItem(toggleCompleted, true)}
                  scrollEnabled={false}
                  activationDistance={4}
                />
              </View>
            </>
            );
          })()}

          {otherRoutines.length > 0 && (
            <>
              <Pressable
                onPress={() => setOtherExpanded((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={`그 외 ${otherRoutines.length}개${otherExpanded ? ', 접기' : ', 펼치기'}`}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.section, marginBottom: spacing.xs, paddingHorizontal: spacing.screen, gap: spacing.xs }}
              >
                <AppIcon name={otherExpanded ? 'ChevronDown' : 'ChevronRight'} size={12} color={c.inkDisabled} />
                <AppText variant="caption" tone="disabled">
                  그 외 {otherRoutines.length}
                </AppText>
              </Pressable>
              {otherExpanded && (
                <View style={{ paddingHorizontal: spacing.screen }}>
                  <DraggableFlatList
                    data={otherRoutines}
                    keyExtractor={(r) => r.id}
                    onDragEnd={handleOtherReorder}
                    renderItem={renderRoutineItem(() => {}, false)}
                    scrollEnabled={false}
                    activationDistance={4}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}

      {editMode ? (
        <EditBottomBar
          selectedCount={selectedIds.size}
          totalCount={routines.length}
          onSelectAll={handleSelectAll}
          onDelete={handleBulkDelete}
        />
      ) : (
        !isEmpty && <FloatingAddButton onPress={openAdd} accessibilityLabel="루틴 추가" />
      )}

      <Coachmark
        visible={showSwipeHint && !editMode}
        message="← 삭제 · 완료 → 스와이프 · 길게 눌러 편집"
        onDismiss={() => {
          markHintSeen('swipeActions');
          markHintSeen('longPressEdit');
        }}
      />

      <RoutineModal
        visible={modalVisible}
        initial={editTarget ?? undefined}
        onSave={handleSave}
        onDelete={editTarget ? () => { removeRoutine(editTarget.id); setModalVisible(false); } : undefined}
        onClose={() => setModalVisible(false)}
      />
      <UndoSnackbar
        message="루틴이 삭제됐어요"
        visible={undoTarget !== null}
        onUndo={() => undoTarget && addRoutine(undoTarget)}
        onDismiss={() => setUndoTarget(null)}
      />
    </SafeAreaView>
  );
}
