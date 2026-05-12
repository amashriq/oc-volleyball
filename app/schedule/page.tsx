import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import EventList from "./EventList";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "Browse upcoming volleyball tournaments and open gym sessions. Filter by type, gender, surface, team size, and skill level.",
  openGraph: {
    title: "Schedule | Outta Control Volleyball",
    description:
      "Browse upcoming volleyball tournaments and open gym sessions.",
  },
};

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, location, registration_link, event_date, start_time, event_type, gender, surface, team_size, skill_levels")
    .eq("is_active", true);
  if (error) throw error;

  return (
    <main>
      <EventList events={events ?? []} />
    </main>
  );
}
