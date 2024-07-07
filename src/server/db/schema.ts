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
import { stat } from "fs";

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

export const trilhasGroups = createTable(
  "trilhas_groups",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const trilhas = createTable(
  "trilhas",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    data: text("data"),
    links: json("links"),
    level: integer("level"),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const roadmaps = createTable(
  "roadmaps",
  {
    id: serial("id").primaryKey(),
    trilhasId: integer("trilha_id")
      .references(() => trilhas.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    trilhasGroupsId: integer("trilha_group_id")
      .references(() => trilhasGroups.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const desafios = createTable(
  "desafios",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    difficulty: text("difficulty"),
    category: text("category"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const roadmapsRelations = relations(roadmaps, ({ one }) => ({
  trilhasGroup: one(trilhasGroups, {
    fields: [roadmaps.trilhasGroupsId],
    references: [trilhasGroups.id],
  }),
  trilha: one(trilhas, {
    fields: [roadmaps.trilhasId],
    references: [trilhas.id],
  }),
}));

export const trilhasGroupsRelations = relations(trilhasGroups, ({ many }) => ({
  roadmaps: many(roadmaps),
}));

export const trilhasRelations = relations(trilhas, ({ many }) => ({
  roadmaps: many(roadmaps),
}));

export const questionGroupRelations = relations(questionGroups, ({ many }) => ({
  questions: many(questions),
}));

export const questionRelations = relations(questions, ({ one }) => ({
  questionGroup: one(questionGroups, {
    fields: [questions.questionGroupId],
    references: [questionGroups.id],
  }),
}));
