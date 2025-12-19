import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const theater = pgTable("theater", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  theaterName: text("theater_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const seat = pgTable("seat", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  theaterId: integer("theater_id")
    .notNull()
    .references(() => theater.id, { onDelete: "cascade" }),
  auditoriumNumber: integer("auditorium_number").notNull(),
  screenType: text("screen_type").notNull().default("Digital"),
  row: text("row").notNull(),
  seatNumber: integer("seat_number").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Inferred types
export type InsertTheater = typeof theater.$inferInsert;
export type SelectTheater = typeof theater.$inferSelect;

export type InsertSeat = typeof seat.$inferInsert;
export type SelectSeat = typeof seat.$inferSelect;
