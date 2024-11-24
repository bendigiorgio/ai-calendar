import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { insertEventSchema } from "@/db/models/event";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message }: { message: string } = await req.json();

  const result = await streamObject({
    model: openai("gpt-4o-mini"),
    system: `You help people manage their schedules by generating the details of events to be saved in a calendar.
        The current date is ${new Date()
          .toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            weekday: "short",
          })
          .replace(/(\w+), (\w+) (\d+), (\d+)/, "$4-$2-$3 ($1)")}.
        When no date is supplied, use the current date.
        `,
    prompt: `Please generate the details for the following event: ${message}`,
    schema: insertEventSchema,
  });

  return result.toTextStreamResponse();
}
