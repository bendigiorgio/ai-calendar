"use server";

import {
  eventTable,
  InsertEvent,
  insertEventSchema,
  selectEventResSchemaArray,
  UpdateEvent,
  updateEventSchema,
} from "@/db/models/event";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const insertEvent = async (event: InsertEvent) => {
  const parsedData = insertEventSchema.safeParse(event);
  if (!parsedData.success) {
    return { error: parsedData.error.issues, data: null };
  }
  const res = await db.insert(eventTable).values(parsedData.data).returning();
  if (!res.length) {
    return { error: "Failed to insert event", data: null };
  }
  return { error: null, data: res[0] };
};

export const getEvents = async () => {
  const res = await db.select().from(eventTable);
  return res;
};

export const getEvent = async (id: number) => {
  const res = await db.select().from(eventTable).where(eq(eventTable.id, id));
  return res;
};

export const getEventByMonth = async (month: number, year: number) => {
  const query = `
  SELECT * 
FROM event 
WHERE strftime('%m', date) = $month 
  AND strftime('%Y', date) = $year;
  `;

  const res = await db.$client.execute({
    sql: query,
    args: {
      month: String(month),
      year: String(year),
    },
  });

  const parsedRes = selectEventResSchemaArray.safeParse(res.rows);
  if (!parsedRes.success) {
    return { error: parsedRes.error.issues, data: null };
  }
  return { error: null, data: parsedRes.data };
};

export const deleteEvent = async (id: number) => {
  await db.delete(eventTable).where(eq(eventTable.id, id));
};

export const updateEvent = async (data: UpdateEvent) => {
  const parsedData = updateEventSchema.safeParse(data);
  if (!parsedData.success) {
    return { error: parsedData.error.issues, data: null };
  }
  const res = await db
    .update(eventTable)
    .set(parsedData.data)
    .where(eq(eventTable.id, data.id!));
  return res;
};
