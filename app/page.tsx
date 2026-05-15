import Link from "next/link";
import PageHero from "./components/PageHero";
import UpcomingEventCard from "./components/UpcomingEventCard";
import { createClient } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createClient();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
  const { data: events, error } = await supabase
    .from("events")
    .select(
      "id, title, event_type, gender, surface, team_size, skill_levels, event_date, start_time, end_time, location, address, cost, cost_type, registration_link",
    )
    .eq("is_active", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(3);
  if (error) throw error;

  return (
    <main>
      <PageHero
        src='/images/hero/CompressedHero1.jpg'
        alt='OC Volleyball Action'
        contentPosition='top'
        heightClass='h-150 md:h-150'
      >
        <h1 className='page-heading'>
          OUTTA
          <br />
          CONTROL
          <br />
          VOLLEYBALL
        </h1>
      </PageHero>

      {events && events.length > 0 && (
        <section className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex justify-between items-baseline mb-6'>
            <h2 className='text-2xl font-black uppercase tracking-tighter text-black'>
              Upcoming Events
            </h2>
            <Link
              href='/schedule'
              className='text-xs font-black uppercase tracking-widest text-red-700 hover:text-red-800 transition-colors duration-300'
            >
              View All →
            </Link>
          </div>

          {/* Mobile: horizontal scroll snap — one card at a time */}
          {/* Desktop: 3-column grid */}
          <div className='events-scroll -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible'>
            {events.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
