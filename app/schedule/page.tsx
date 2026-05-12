import { createClient } from "@/lib/supabase-server";
import EventList from "./EventList";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").eq("is_active", true);

  return (
    <main>
      <EventList events={events ?? []} />
    </main>
  );
}
