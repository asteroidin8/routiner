import { useEffect, useState } from 'react';

import { DatePickerModal } from './DatePickerModal';
import { SheetDangerButton, SheetModal, SheetPrimaryButton } from './SheetModal';
import { TodoFormFields, todayStr } from './TodoFormFields';
import type { Todo, TodoPriority } from '@/stores/useTodoStore';

export type TodoCreatePayload = {
  title: string;
  priority: TodoPriority;
  dueDate: string | null;
  pinnedToHome: boolean;
  groupId: string | null;
  section: string | null;
};

type BaseProps = {
  visible: boolean;
  onClose: () => void;
};

type CreateProps = BaseProps & {
  mode?: 'create';
  todo?: never;
  onSave: (payload: TodoCreatePayload) => void;
  onDelete?: never;
};

type EditProps = BaseProps & {
  mode: 'edit';
  todo: Todo | null;
  onSave: (updates: Pick<Todo, 'title' | 'priority' | 'dueDate' | 'pinnedToHome' | 'groupId' | 'section'>) => void;
  onDelete: () => void;
};

type Props = CreateProps | EditProps;

function TodoModalInner(props: Props) {
  const { visible, onClose } = props;
  const isEdit = props.mode === 'edit';

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('mid');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [section, setSection] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (isEdit && props.todo) {
      setTitle(props.todo.title);
      setPriority(props.todo.priority);
      setDueDate(props.todo.dueDate);
      setGroupId(props.todo.groupId ?? null);
      setSection(props.todo.section ?? '');
      setDatePickerVisible(false);
    }
  }, [isEdit ? props.todo : null]);

  function reset() {
    setTitle('');
    setPriority('mid');
    setDueDate(null);
    setGroupId(null);
    setSection('');
  }

  function handleSave() {
    if (!title.trim()) return;
    const payload = { title: title.trim(), priority, dueDate, pinnedToHome: false, groupId, section: section.trim() || null };
    props.onSave(payload as never);
    if (!isEdit) reset();
  }

  function handleClose() {
    if (!isEdit) reset();
    onClose();
  }

  return (
    <>
      <SheetModal
        visible={visible}
        onClose={handleClose}
        title={isEdit ? '할 일 편집' : '할 일 추가'}
        footer={
          <>
            <SheetPrimaryButton label={isEdit ? '저장' : '추가'} onPress={handleSave} disabled={!title.trim()} />
            {isEdit && props.onDelete && <SheetDangerButton label="삭제" onPress={props.onDelete} />}
          </>
        }
      >
        <TodoFormFields
          title={title}
          onTitleChange={setTitle}
          priority={priority}
          onPriorityChange={setPriority}
          dueDate={dueDate}
          onDueDateChange={setDueDate}
          groupId={groupId}
          onGroupIdChange={setGroupId}
          section={section}
          onSectionChange={setSection}
          onDatePickerOpen={() => setDatePickerVisible(true)}
        />
      </SheetModal>

      <DatePickerModal
        visible={datePickerVisible}
        value={dueDate}
        minimumDate={todayStr()}
        onConfirm={(date) => { setDueDate(date); setDatePickerVisible(false); }}
        onClose={() => setDatePickerVisible(false)}
      />
    </>
  );
}

export function TodoModal({ visible, onSave, onClose }: { visible: boolean; onSave: (payload: TodoCreatePayload) => void; onClose: () => void }) {
  return <TodoModalInner visible={visible} onSave={onSave} onClose={onClose} />;
}

export function TodoEditModal({ visible, todo, onSave, onDelete, onClose }: { visible: boolean; todo: Todo | null; onSave: (updates: Pick<Todo, 'title' | 'priority' | 'dueDate' | 'pinnedToHome' | 'groupId' | 'section'>) => void; onDelete: () => void; onClose: () => void }) {
  return <TodoModalInner mode="edit" visible={visible} todo={todo} onSave={onSave} onDelete={onDelete} onClose={onClose} />;
}
