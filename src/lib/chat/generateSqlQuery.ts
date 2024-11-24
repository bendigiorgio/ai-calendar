"use server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { selectEventResSchemaArray } from "@/db/models/event";
import { db } from "../db";

export const queryForEvent = async (message: string) => {
  console.log("queryForEvent", message);
  const res = await generateText({
    model: openai("gpt-4o-mini"),
    system: `You are helping a user find a relevant event in the database.
    You should narrow it down to relevant events and should query the database using SQL to find relevant events.
    You should response with a SQL query that will return the event data that matches the query. The table name is 'event'.
    Ensure that the SQL query is valid and will return the correct data. Respond with only the SQL query and nothing else in plain text with no decorations.
    Make sure that your response only includes the SQL query and nothing else. Make sure you don't edit any data and only use selects.
    `,
    prompt: message,
  });

  console.log("Executing query", res.text);
  const dbRes = await db.$client.execute({
    sql: res.text,
    args: {},
  });

  const parsedRes = selectEventResSchemaArray.safeParse(dbRes.rows);

  if (!parsedRes.success) {
    throw new Error(parsedRes.error.errors.join(", "));
  }
  return parsedRes.data;
};
