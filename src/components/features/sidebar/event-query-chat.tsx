"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SelectEventResArray } from "@/db/models/event";
import { queryForEvent } from "@/lib/chat/generateSqlQuery";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { parseAsFloat, useQueryState } from "nuqs";
import React from "react";

const EventQueryChat = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMonth] = useQueryState("month", parseAsFloat);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, setYear] = useQueryState("year", parseAsFloat);
  const [message, setMessage] = React.useState("");
  const [events, setEvents] = React.useState<SelectEventResArray>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const queryDbMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await queryForEvent(message);
      setEvents(res);
      return res;
    },
  });
  return (
    <div className="space-y-4">
      <Textarea
        ref={textareaRef}
        placeholder="何を探している？"
        value={message}
        name="message"
        onInput={(e) => {
          setMessage(e.currentTarget.value);
        }}
      />
      <Button
        onClick={() => {
          queryDbMutation.mutate(message);
        }}
      >
        検索
      </Button>
      <div className="space-y-4 pt-4">
        <h4 className="text-lg font-bold">結果</h4>
        <ul className="text-sm ">
          {events.map((event) => (
            <li className="flex gap-x-4" key={event.id}>
              <div>
                <p>- {event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(event.date, "P")} {format(event.startTime, "p")} -{" "}
                  {format(event.endTime, "p")}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  const year = event.date.getFullYear();
                  const month = event.date.getMonth() + 1;
                  setYear(year);
                  setMonth(month);
                }}
              >
                遷移
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventQueryChat;
