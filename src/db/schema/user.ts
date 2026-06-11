import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 사용자 프로필 테이블 (단일 행)
export const userProfile = sqliteTable('user_profile', {
  id: integer('id').primaryKey(), // 항상 1
  heightCm: real('height_cm'),
  weightKg: real('weight_kg'),
  targetWeightKg: real('target_weight_kg'),
  updatedAt: integer('updated_at').notNull(),
});

// 체중 기록 히스토리
export const weightHistory = sqliteTable('weight_history', {
  id: text('id').primaryKey(),
  weightKg: real('weight_kg').notNull(),
  recordedDate: text('recorded_date').notNull(), // 'YYYY-MM-DD'
  createdAt: integer('created_at').notNull(),
});
