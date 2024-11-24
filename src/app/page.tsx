import { getEventByMonth } from "@/actions/event";
import BigCalendar from "@/components/features/calendar/big-calendar";
import ChangeDay from "@/components/features/calendar/change-day";
import Sidebar from "@/components/features/sidebar";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const month =
    typeof params?.month === "string"
      ? Number(params?.month)
      : new Date().getMonth() + 1;
  const year =
    typeof params?.year === "string"
      ? Number(params?.year)
      : new Date().getFullYear();

  const initialEvents = await getEventByMonth(month, year);

  return (
    <div className="w-screen max-w-full overflow-clip h-screen flex flex-row">
      <Sidebar />
      <div className="flex-grow flex-1 flex-col h-full w-full flex">
        <header className="p-4 justify-between flex items-center">
          <h1 className="text-3xl">カレンダー</h1>
          <ChangeDay />
        </header>
        <main className="flex flex-1 flex-grow flex-col overflow-y-auto">
          <BigCalendar events={initialEvents.data ?? []} />
        </main>
      </div>
    </div>
  );
}
