import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PageHero from "@/app/components/PageHero";

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-start border-b border-gray-100 last:border-0 py-5'>
      <span className='w-full sm:w-48 shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 sm:mb-0 sm:pt-0.5'>
        {label}
      </span>
      <span className='text-sm font-black uppercase tracking-tighter text-black'>
        {value}
      </span>
    </div>
  );
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select(
      "id, title, description, event_type, gender, surface, team_size, skill_levels, event_date, start_time, end_time, location, address, cost, cost_type, capacity, registration_link, image_url",
    )
    .eq("id", id)
    .single();

  if (!event) notFound();

  const eventTypeLabel =
    event.event_type === "tournament" ? "Tournament" : "Open Gym";

  const genderLabel =
    event.gender.charAt(0).toUpperCase() + event.gender.slice(1);

  const surfaceLabel =
    event.surface.charAt(0).toUpperCase() + event.surface.slice(1);

  const skillLabel =
    event.skill_levels && event.skill_levels.length > 0
      ? event.skill_levels.map((s: string) => s.toUpperCase()).join(", ")
      : "Open";

  const timeLabel = event.end_time
    ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`
    : formatTime(event.start_time);

  const costLabel =
    event.cost === 0
      ? "Free"
      : `$${event.cost} / ${event.cost_type === "team" ? "Team" : "Individual"}`;

  const capacityLabel = event.capacity ? `${event.capacity}` : "Unlimited";

  return (
    <main>
      <PageHero src='/images/schedule/oc14edit.JPG' alt='OC Volleyball Action'>
        <div className='max-w-7xl mx-auto px-6 w-full'>
          <h1 className='page-heading'>{event.title}</h1>
        </div>
      </PageHero>

      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30'>
        {/* Info Box */}
        <div className='bg-white shadow-md p-8 md:p-10'>
          <h2 className='text-2xl font-black uppercase tracking-tighter text-black mb-4'>
            Event Details
          </h2>
          {event.description && (
            <p className='text-black leading-relaxed text-sm md:text-base'>
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 mt-8 mb-16'>
        {/* Section header */}
        <div className='bg-[#001D3D] text-white p-6 shadow-md'>
          <h2 className='text-4xl font-black leading-none tracking-tighter'>
            {event.title}
          </h2>
        </div>

        {/* Column headers */}
        <div className='bg-[#001226] text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-8 py-3'>
          Event Information
        </div>

        {/* Detail rows */}
        <div className='bg-white border-x border-b border-gray-200 shadow-sm px-8'>
          <DetailRow label='Date' value={formatDate(event.event_date)} />
          <DetailRow label='Time' value={timeLabel} />
          <DetailRow label='Event Type' value={eventTypeLabel} />
          <DetailRow label='Gender' value={genderLabel} />
          <DetailRow label='Surface' value={surfaceLabel} />
          <DetailRow label='Team Size' value={event.team_size} />
          <DetailRow label='Skill Level' value={skillLabel} />
          <DetailRow label='Cost' value={costLabel} />
          <DetailRow label='Capacity' value={capacityLabel} />
          <DetailRow label='Location' value={event.location} />
          {event.address && <DetailRow label='Address' value={event.address} />}
          <DetailRow
            label='Registration'
            value={
              event.registration_link ? (
                <Link
                  href={event.registration_link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-red-700 border-b-2 border-red-700/20 hover:border-red-700 pb-1 transition-all'
                >
                  Register Now
                </Link>
              ) : (
                <span className='text-gray-300'>Closed</span>
              )
            }
          />
        </div>
      </div>
    </main>
  );
}
