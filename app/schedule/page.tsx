import { supabase } from "@/lib/supabase";
import EventList from "./EventList";

export default async function SchedulePage() {
  const { data: events } = await supabase.from("events").select("*");

  return (
    <main>
      <h1>OC Volleyball Schedule</h1>
      <EventList events={events ?? []} />
    </main>
  );
}
