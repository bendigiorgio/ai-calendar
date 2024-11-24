import { deleteEvent, insertEvent, updateEvent } from "@/actions/event";
import {
  InsertEvent,
  insertEventSchema,
  updateEventSchema,
} from "@/db/models/event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEvent = () => {
  const queryClient = useQueryClient();
  const insertMutation = useMutation({
    mutationFn: async (event: InsertEvent) => {
      const parsedData = insertEventSchema.safeParse(event);
      if (!parsedData.success) {
        throw new Error(parsedData.error.errors.join(", "));
      }
      const res = await insertEvent(parsedData.data);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      return res;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (event: InsertEvent) => {
      const parsedData = updateEventSchema.safeParse(event);
      if (!parsedData.success) {
        throw new Error(parsedData.error.errors.join(", "));
      }
      const res = await updateEvent(parsedData.data);
      queryClient.invalidateQueries({
        queryKey: ["event", event.id, "events"],
      });
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteEvent(id);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      return res;
    },
  });
  return { insertMutation, updateMutation, deleteMutation };
};
