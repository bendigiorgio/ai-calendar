"use client";
import { CalendarEvent } from "@/db/models/event";
import React from "react";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { parseAsFloat, useQueryState } from "nuqs";
import { getEventByMonth } from "@/actions/event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEvent } from "@/client-actions/event";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface BigCalendarProps {
  events: CalendarEvent[];
}

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

const BigCalendar = ({ events }: BigCalendarProps) => {
  const [month] = useQueryState(
    "month",
    parseAsFloat.withDefault(new Date().getMonth() + 1)
  );
  const [year] = useQueryState(
    "year",
    parseAsFloat.withDefault(new Date().getFullYear())
  );

  const eventQuery = useQuery({
    queryKey: ["events", month, year],
    queryFn: async () => {
      const res = await getEventByMonth(month, year);
      if (res.error) {
        throw new Error(res.error.join(", "));
      }
      return res.data;
    },
    initialData: events,
    refetchOnWindowFocus: false,
  });

  const getDays = () => {
    const daysInMonth = (month: number, year: number) =>
      new Date(year, month, 0).getDate();

    const firstDayOfMonth = new Date(year, month - 1, 1);

    const firstDayIndex = firstDayOfMonth.getDay();

    const prevMonthDays = daysInMonth(
      month - 1 === 0 ? 12 : month - 1,
      month - 1 === 0 ? year - 1 : year
    );
    const nextMonthStart = 1;

    const calendarDays: Array<{
      day: number;
      type: "prev" | "current" | "next";
      events: CalendarEvent[];
    }> = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      calendarDays.push({
        day,
        type: "prev",
        events: eventQuery.data.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getDate() === day && eventDate.getMonth() === month - 2
          );
        }),
      });
    }

    for (let day = 1; day <= daysInMonth(month, year); day++) {
      calendarDays.push({
        day,
        type: "current",
        events: eventQuery.data.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getFullYear() === year &&
            eventDate.getMonth() === month - 1 &&
            eventDate.getDate() === day
          );
        }),
      });
    }

    for (let day = nextMonthStart; calendarDays.length % 7 !== 0; day++) {
      calendarDays.push({
        day,
        type: "next",
        events: [],
      });
    }
    return calendarDays;
  };

  const mappedDays = getDays();
  return (
    <div className="h-full w-full flex flex-col min-h-fit">
      <div className="grid grid-cols-7">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center border p-4 text-lg font-bold h-fit"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-full w-full">
        {mappedDays.map(({ day, events, type }, i) => (
          <CalendarDay
            key={`${day}-${i}`}
            day={day}
            events={events}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

const CalendarDay = ({
  day,
  events,
  type,
}: {
  day: number;
  events: CalendarEvent[];
  type: "prev" | "current" | "next";
}) => {
  return (
    <div
      className={cn(
        "border h-full w-full",
        type === "prev" || type === "next" ? "opacity-50" : undefined
      )}
    >
      <div className="flex justify-end p-2 text-sm">{day}</div>
      <div className="flex flex-col gap-y-2">
        {events.map((event) => (
          <CalendarEventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

const CalendarEventItem = ({ event }: { event: CalendarEvent }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(event.title);
  const [description, setDescription] = React.useState(event.description ?? "");
  const [location, setLocation] = React.useState(
    event.location ? event.location : ""
  );

  const { deleteMutation } = useEvent();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        setEditing(false);
        setIsOpen(e);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-none h-fit max-w-full whitespace-normal"
        >
          <div className="text-sm">{event.title}</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? (
              <Input
                name="title"
                value={title}
                onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
              />
            ) : (
              title
            )}
          </DialogTitle>
          <DialogDescription>
            {editing ? (
              <Textarea
                name="description"
                value={description}
                onInput={(e) =>
                  setDescription((e.target as HTMLTextAreaElement).value)
                }
              />
            ) : (
              description
            )}
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>
            {format(event.date, "P")} {format(event.startTime, "p")} -{" "}
            {format(event.endTime, "p")}
          </p>
          <p>
            {editing ? (
              <Input
                name="location"
                value={location}
                onInput={(e) =>
                  setLocation((e.target as HTMLInputElement).value)
                }
              />
            ) : (
              location
            )}
          </p>
        </div>
        <DialogFooter>
          {editing ? (
            <Button
              type="button"
              onClick={() => {
                setEditing(!editing);
              }}
            >
              保存
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(!editing);
              }}
            >
              更新
            </Button>
          )}
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              deleteMutation.mutate(event.id);
              setIsOpen(false);
            }}
          >
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BigCalendar;
