import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const eventTable = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  location: text(),
  date: text().notNull(),
  startTime: text().notNull(),
  endTime: text().notNull(),
});

export const insertEventSchema = createInsertSchema(eventTable, {
  date: z.coerce.date().transform((date) => date.toISOString()),
  startTime: z.coerce.date().transform((date) => date.toISOString()),
  endTime: z.coerce.date().transform((date) => date.toISOString()),
});
export const updateEventSchema = createInsertSchema(eventTable, {
  id: z.number().describe("The id of the event"),
});

export const selectEventResSchema = createSelectSchema(eventTable, {
  id: z.number().describe("The id of the event"),
  title: z.string().describe("The title of the event"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("The description of the event"),
  location: z
    .string()
    .nullable()
    .optional()
    .describe("The location of the event"),
  date: z.coerce.date().describe("The date of the event"),
  startTime: z.coerce.date().describe("The start time of the event"),
  endTime: z.coerce.date().describe("The end time of the event"),
});
export const selectEventResSchemaArray = z.array(selectEventResSchema);

export const selectEventQuerySchema = createSelectSchema(eventTable);

export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type SelectEventQuery = z.infer<typeof selectEventQuerySchema>;
export type CalendarEvent = z.infer<typeof selectEventResSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type SelectEventResArray = z.infer<typeof selectEventResSchemaArray>;
