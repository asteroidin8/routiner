import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 단식 기록 테이블
export const fastingRecords = sqliteTable('fasting_records', {
  id: text('id').primaryKey(), // UUID
  startedAt: integer('started_at').notNull(), // Unix timestamp (ms)
  endedAt: integer('ended_at'), // null이면 진행 중
  goalHours: real('goal_hours').notNull(),
  weightKgBefore: real('weight_kg_before'), // 단식 전 체중 (선택)
  weightKgAfter: real('weight_kg_after'), // 단식 후 체중 (선택)
  createdAt: integer('created_at').notNull(),
});
