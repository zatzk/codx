/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  json,
  integer,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `codx_${name}`);

export const questionGroups = createTable(
  "question_groups",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    title: varchar("title", { length: 256 }),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

// Define the Questions table schema
export const questions = createTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    questionGroupId: integer("question_group_id")
      .references(() => questionGroups.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    question: varchar("question"),
    answer: text("answer"), // Use text data type for potentially longer answers
    topics: json("topics"), // Store topics as a JSON array
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const questionGroupRelations = relations(questionGroups, ({ many }) => ({
  questions: many(questions),
}));

export const questionRelations = relations(questions, ({ one }) => ({
  questionGroup: one(questionGroups, {
    fields: [questions.questionGroupId],
    references: [questionGroups.id],
  }),
}));
