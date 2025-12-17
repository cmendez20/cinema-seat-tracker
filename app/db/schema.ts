import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const auditoriumType = pgEnum("auditorium_type", [
  "imax",
  "dolby",
  "digital",
]);

export const theater = pgTable("theater", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  theaterName: text("theater_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditorium = pgTable("auditorium", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  theaterId: integer("theater_id")
    .notNull()
    .references(() => theater.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  type: auditoriumType("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const seat = pgTable("seat", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  auditoriumId: integer("auditorium_id")
    .notNull()
    .references(() => auditorium.id, { onDelete: "cascade" }),
  row: text("row").notNull(),
  seatNumber: integer("seat_number").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Inferred types
export type InsertTheater = typeof theater.$inferInsert;
export type SelectTheater = typeof theater.$inferSelect;

export type InsertAuditorium = typeof auditorium.$inferInsert;
export type SelectAuditorium = typeof auditorium.$inferSelect;

export type InsertSeat = typeof seat.$inferInsert;
export type SelectSeat = typeof seat.$inferSelect;
