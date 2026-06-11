import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 투두 테이블
export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  priority: text('priority', { enum: ['high', 'mid', 'low'] })
    .notNull()
    .default('mid'),
  dueDate: text('due_date'), // 'YYYY-MM-DD' 형식, null이면 기한 없음
  completedAt: integer('completed_at'), // Unix timestamp (ms), null이면 미완료
  createdAt: integer('created_at').notNull(),
});
