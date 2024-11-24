"use client";
import React from "react";
import { toast } from "sonner";
import { experimental_useObject } from "ai/react";
import { InsertEvent, insertEventSchema } from "@/db/models/event";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { format } from "date-fns";
import { useEvent } from "@/client-actions/event";

import { useQueryClient } from "@tanstack/react-query";

const EventGenChat = () => {
  const queryClient = useQueryClient();
  const [event, setEvent] = React.useState<InsertEvent | null>(null);
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { insertMutation } = useEvent();
  const { submit, isLoading, object } = experimental_useObject({
    api: "/api/generate-event",
    schema: insertEventSchema,
    onFinish({ object }) {
      if (object != null) {
        setEvent(object);
        setInput("");
      }
    },
    onError: () => {
      toast.error("エラーが発生しました");
    },
  });

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-y-2 relative items-center"
        onSubmit={(event) => {
          event.preventDefault();

          const form = event.target as HTMLFormElement;

          const input = form.elements.namedItem("message") as HTMLInputElement;

          if (input.value.trim()) {
            submit({ message: input.value });
          }
        }}
      >
        <div className="space-y-4 w-full">
          <Textarea
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="カレンダーの予定を説明してください"
            disabled={isLoading}
            ref={inputRef}
          />
          <Button variant={event ? "secondary" : "default"}>
            予定を生成する
          </Button>
        </div>
      </form>
      <div className="border-t pt-2">
        {isLoading ? <p>生成中...</p> : null}
        {object != null ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="grid grid-cols-[5rem_1fr] col-span-2 items-center gap-3">
              <span className="font-medium text-muted-foreground text-right">
                予定名
              </span>
              <div>{object?.title}</div>
            </div>
            <div className="grid grid-cols-[5rem_1fr] col-span-2 items-center gap-3">
              <span className="font-medium text-muted-foreground text-right">
                日時
              </span>
              <div className="flex flex-col">
                <p>
                  {object?.date
                    ? !isLoading
                      ? format(object?.date, "P")
                      : object?.date
                    : null}
                </p>
                <p>
                  {object?.startTime
                    ? !isLoading
                      ? format(object.startTime, "p")
                      : object?.startTime
                    : null}
                  〜
                  {object?.endTime
                    ? !isLoading
                      ? format(object.endTime, "p")
                      : object?.endTime
                    : null}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[5rem_1fr] col-span-2 items-center gap-3">
              <span className="font-medium text-muted-foreground text-right">
                場所
              </span>
              <div>{object?.location}</div>
            </div>
            <div className="grid grid-cols-[5rem_1fr] col-span-2 items-center gap-3">
              <span className="font-medium text-muted-foreground text-right">
                説明
              </span>
              <div>{object?.description}</div>
            </div>
          </div>
        ) : null}
        {!isLoading && event ? (
          <div className="flex items-center justify-center gap-x-6 mt-4">
            <Button
              onClick={async () => {
                const res = await insertMutation.mutateAsync(event);
                if (res.error !== null) {
                  toast.error("エラーが発生しました");
                  return;
                }
                toast.success(`${res.data.title}：予定を追加しました`);
                setEvent(null);
                setInput("");
                queryClient.invalidateQueries({ queryKey: ["events"] });
              }}
            >
              追加する
            </Button>
            <Button
              onClick={() => {
                setEvent(null);
                setInput("");
                inputRef.current?.focus();
              }}
              variant="destructive"
            >
              キャンセル
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventGenChat;
