import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 루틴 정의 테이블
export const routines = sqliteTable('routines', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  repeatDays: text('repeat_days').notNull(), // JSON: number[] (0=일 ~ 6=토)
  reminderTime: text('reminder_time'), // 'HH:mm' 형식, null이면 알림 없음
  createdAt: integer('created_at').notNull(),
});

// 루틴 달성 기록 테이블
export const routineCompletions = sqliteTable('routine_completions', {
  id: text('id').primaryKey(),
  routineId: text('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  completedDate: text('completed_date').notNull(), // 'YYYY-MM-DD'
  createdAt: integer('created_at').notNull(),
});
