// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mmu_${name}`);

export const supportedCurrency = pgEnum("supported_currency", ["GBP"]);
export const users = createTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }),
    emailVerified: boolean("email_verified").default(false),
    image: varchar("image", { length: 256 }),
    portfolioValue: bigint("portfolio_value", {
      mode: "number",
    })
      .default(0)
      .notNull(),
    defaultCurrency: supportedCurrency("default_currency")
      .default("GBP")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (user) => ({
    nameIndex: index("users_name_idx").on(user.name),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = createTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    accountId: varchar("account_id", { length: 256 }).notNull(),
    providerId: varchar("provider", { length: 256 }).notNull(),
    accessToken: varchar("access_token", { length: 256 }),
    refreshToken: varchar("refresh_token", { length: 256 }),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: varchar("scope", { length: 256 }),
    idToken: varchar("id_token", { length: 256 }),
    password: varchar("password", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (account) => ({
    userIdIndex: index("accounts_user_id_idx").on(account.userId),
    accountIdIndex: index("accounts_account_id_idx").on(account.accountId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const verifications = createTable(
  "verifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: varchar("identifier", { length: 256 }).notNull(),
    value: varchar("value", { length: 256 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (verification) => ({
    identifierIndex: index("verifications_identifier_idx").on(
      verification.identifier,
    ),
  }),
);

export const sessions = createTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    token: varchar("token", { length: 256 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: varchar("ip_address", { length: 256 }),
    userAgent: varchar("user_agent", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (session) => ({
    userIdIndex: index("sessions_user_id_idx").on(session.userId),
  }),
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const expenseCategory = pgEnum("expense_category", [
  "FOOD",
  "TRANSPORT",
  "SHOPPING",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTH",
  "OTHER",
]);

export const incomeCategory = pgEnum("income_category", [
  "SALARY",
  "FREELANCE",
  "INVESTMENT",
  "GIFT",
  "OTHER",
]);

export const expenses = createTable(
  "expenses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: supportedCurrency("currency").notNull(),
    category: expenseCategory("category").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (expense) => ({
    userIdIndex: index("expenses_user_id_idx").on(expense.userId),
  }),
);

export const incomes = createTable(
  "incomes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: supportedCurrency("currency").notNull(),
    category: incomeCategory("category").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (income) => ({
    userIdIndex: index("incomes_user_id_idx").on(income.userId),
  }),
);
