import { createClient } from "@/lib/supabase-server";
import EventList from "./EventList";

export const revalidate = 0;

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*");

  return (
    <main>
      <EventList events={events ?? []} />
    </main>
  );
}
