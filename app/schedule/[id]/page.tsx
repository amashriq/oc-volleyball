import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PageHero from "@/app/components/PageHero";
import { formatTime, formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!event) return {};

  return {
    title: event.title,
    description: event.description ?? undefined,
    openGraph: {
      title: `${event.title} | Outta Control Volleyball`,
      description: event.description ?? undefined,
    },
  };
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

  const timeLabel = event.end_time
    ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`
    : formatTime(event.start_time);

  const costLabel =
    event.cost === 0
      ? "Free"
      : `$${event.cost} / ${event.cost_type === "team" ? "Team" : "Individual"}`;

  return (
    <main>
      <PageHero src='/images/schedule/oc14.JPG' alt='OC Volleyball Action'>
        <div className='max-w-7xl mx-auto px-6 w-full'>
          <h1 className='page-heading'>{event.title}</h1>
        </div>
      </PageHero>

      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30 mb-20'>
        <div className='bg-white shadow-md p-8 md:p-10'>
          {/* Pills + skill badges */}
          <div className='flex items-start justify-between gap-4 mb-6'>
            <div className='flex flex-wrap gap-2'>
              <span className='inline-flex items-center gap-1.5 bg-[#001D3D] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5'>
                {eventTypeLabel}
              </span>

              <span className='inline-flex items-center gap-1.5 bg-[#001D3D] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5'>
                {surfaceLabel}
              </span>

              <span className='inline-flex items-center gap-1.5 bg-[#001D3D] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5'>
                {genderLabel}
              </span>
            </div>

            {event.skill_levels && event.skill_levels.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {event.skill_levels.map((s: string) => (
                  <span
                    key={s}
                    className='bg-black text-white text-xs font-black uppercase tracking-widest px-3 py-1.5'
                  >
                    {s.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Date + time */}
          <div className='flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-4 mb-3'>
            <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none'>
              {formatDate(event.event_date)}
            </h2>
            <span className='text-2xl font-black uppercase tracking-tighter text-gray-400 leading-none'>
              {timeLabel}
            </span>
          </div>

          {/* Description */}
          {event.description && (
            <p className='text-gray-600 leading-relaxed text-sm md:text-base mb-8'>
              {event.description}
            </p>
          )}

          <div className='border-t border-gray-100 mb-8' />

          {/* Detail grid */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
            <div className='flex gap-3'>
              <div>
                <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                  Team Size
                </div>
                <div className='text-sm font-black uppercase tracking-tighter text-black'>
                  {event.team_size}
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <div>
                <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                  Cost
                </div>
                <div className='text-sm font-black uppercase tracking-tighter text-black'>
                  {costLabel}
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <div>
                <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                  Location
                </div>
                <div className='text-sm font-black uppercase tracking-tighter text-black'>
                  {event.location}
                </div>
                {event.address && (
                  <div className='text-xs text-gray-500 mt-0.5'>
                    {event.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Register button */}
          {event.registration_link ? (
            <Link
              href={event.registration_link}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full flex items-center justify-center duration-300 bg-red-700 hover:bg-red-800 text-white text-sm font-black uppercase tracking-widest px-8 py-4 transition-colors'
            >
              Register Now
            </Link>
          ) : (
            <span className='w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-black uppercase tracking-widest px-8 py-4 cursor-not-allowed'>
              Registration Closed
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
