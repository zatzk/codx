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
  index,
  primaryKey,
  json,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { object } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `codx_${name}`);



export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull().default("user"),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  level: integer("level").notNull().default(1),
  exp: integer("exp").notNull().default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const expEvents = createTable(
  "exp_events",
  {
    minExp: integer("min_exp").notNull(),
    level: integer("level").notNull(),
  }
)

export const expEventsRelations = relations(expEvents, ({ one }) => ({
  user: one(users, { fields: [expEvents.minExp], references: [users.exp] }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const questionGroups = createTable(
  "question_groups",
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

export const questionUserProgress = createTable(
  "question_user_progress",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    // Denormalized question data
    questionGroupId: integer("question_group_id").notNull(),
    questionGroupName: varchar("question_group_name", { length: 256 }).notNull(),
    // Progress data
    responses: json("responses").$type<Array<{
      questionId: number;
      questionText: string;
      response: string;
      correct: boolean;
      timestamp: Date;
    }>>().default([]),
    stats: json("stats").$type<{
      knowCount: number;
      didntKnowCount: number;
      skipCount: number;
    }>().default({ knowCount: 0, didntKnowCount: 0, skipCount: 0 }),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userQuestionGroupIdx: index("user_question_group_idx").on(table.userId, table.questionGroupId),
  })
);

export const questionUserProgressRelations = relations(questionUserProgress, ({ one }) => ({
  user: one(users, { fields: [questionUserProgress.userId], references: [users.id] }),
  questionGroup: one(questionGroups, { fields: [questionUserProgress.questionGroupId], references: [questionGroups.id] }),
}));


export const questions = createTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    questionGroupId: integer("question_group_id")
      .references(() => questionGroups.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    question: varchar("question"),
    answer: text("answer"),
    topics: json("topics"),
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
    level: integer("level"),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const trilhasLinks = createTable(
  "trilhas_links",
  {
    id: serial("id").primaryKey(),
    trilhaId: integer("trilha_id")
      .references(() => trilhas.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    type: varchar("type", { length: 50 }).notNull(), // e.g., "ARTICLE", "YOUTUBE"
    title: varchar("title", { length: 255 }).notNull(),
    link: text("link").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  }
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
    title: varchar("title", { length: 256 }),
    problemStatement: text("problem_statement"),
    starterCode: text("starter_code"),
    functionName: text("function_name"),
    examples: json("examples"),
    difficulty: text("difficulty"),
    category: text("category"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);
export const testCases = createTable(
  "test_cases",
  {
    id: serial("id").primaryKey(),
    desafioId: integer("desafio_id")
      .references(() => desafios.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    input: text("input"),
    target: text("target"),
    expectedOutput: text("expected_output"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
)

export const paths = createTable(
  "paths",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const pathCourses = createTable(
  "path_courses",
  {
    id: serial("id").primaryKey(),
    pathId: integer("path_id")
      .references(() => paths.id, { onDelete: "cascade", onUpdate: "cascade" }),
    courseId: integer("course_id")
      .references(() => courses.id, { onDelete: "cascade", onUpdate: "cascade" }),
    order: integer("order"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => ({
    uniquePathOrder: unique().on(table.pathId, table.order), // Ensure unique order per path
  })
);

export const courses = createTable (
  "courses",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    description: varchar("description"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const courseModules = createTable(
  "course_modules",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .references(() => courses.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    title: varchar("title", { length: 256 }),
    description: varchar("description"),
    order: integer("order"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);
export const lessons = createTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    moduleId: integer("module_id")
      .references(() => courseModules.id,
        { onDelete: "cascade", onUpdate: "cascade", }),
    title: varchar("title", { length: 256 }),
    content: text("content"),
    videoUrl: varchar("video_url", { length: 256 }),
    description: varchar("description"),
    order: integer("order"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
);

export const courseUserProgress = createTable(
  "course_user_progress",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    // Denormalized course data
    courseId: integer("course_id").notNull(),
    courseTitle: varchar("course_title", { length: 256 }).notNull(),
    courseDescription: text("course_description"),
    // Progress data
    modules: json("modules").$type<Array<{
      moduleId: number;
      moduleTitle: string;
      lessons: Array<{
        lessonId: number;
        completedAt: Date;
      }>
    }>>().default([]),
    currentModule: integer("current_module_index").default(0).notNull(),
    currentLesson: integer("current_lesson_index").default(0).notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userCourseIdx: index("user_course_idx").on(table.userId, table.courseId),
  })
);

export const pathCoursesRelations = relations(pathCourses, ({ one }) => ({
  path: one(paths, { fields: [pathCourses.pathId], references: [paths.id] }),
  course: one(courses, { fields: [pathCourses.courseId], references: [courses.id] }),
}));
export const pathsRelations = relations(paths, ({ many }) => ({
  pathCourses: many(pathCourses),
}));
export const coursesRelations = relations(courses, ({ many }) => ({
  pathCourses: many(pathCourses),
  modules: many(courseModules),
}));
export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, { fields: [courseModules.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));
export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(courseModules, { fields: [lessons.moduleId], references: [courseModules.id] }),
}));



export const desafioRelations = relations(desafios, ({ many }) => ({
  testCases: many(testCases),
}));

export const testCasesRelations = relations(testCases, ({ one }) => ({
  desafio: one(desafios, {
    fields: [testCases.desafioId],
    references: [desafios.id],
  }),
}));

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
  links: many(trilhasLinks), // One trilha can have many links
}));

export const trilhasLinksRelations = relations(trilhasLinks, ({ one }) => ({
  trilha: one(trilhas, {
    fields: [trilhasLinks.trilhaId],
    references: [trilhas.id],
  }), // Each link belongs to one trilha
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
