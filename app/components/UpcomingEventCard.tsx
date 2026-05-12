import Link from "next/link";
import type { Event } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/format";

type Props = {
  event: Pick<
    Event,
    | "id"
    | "title"
    | "event_type"
    | "gender"
    | "surface"
    | "team_size"
    | "skill_levels"
    | "event_date"
    | "start_time"
    | "end_time"
    | "location"
    | "address"
    | "cost"
    | "cost_type"
    | "registration_link"
  >;
};

export default function UpcomingEventCard({ event }: Props) {
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
    <article className='w-[82vw] md:w-auto md:min-w-0 snap-start shrink-0 bg-white shadow-md flex flex-col h-120 md:h-120'>
      <div className='flex flex-col flex-1 p-6 overflow-hidden'>
        {/* Pills */}
        <div className='flex flex-wrap gap-1.5 mb-3'>
          <span className='inline-flex items-center bg-[#001D3D] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1'>
            {eventTypeLabel}
          </span>
          <span className='inline-flex items-center bg-[#001D3D] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1'>
            {surfaceLabel}
          </span>
          <span className='inline-flex items-center bg-[#001D3D] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1'>
            {genderLabel}
          </span>
          {event.skill_levels &&
            event.skill_levels.length > 0 &&
            event.skill_levels.map((s: string) => (
              <span
                key={s}
                className='inline-flex items-center bg-black text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1'
              >
                {s.toUpperCase()}
              </span>
            ))}
        </div>

        {/* Title */}
        <Link href={`/schedule/${event.id}`}>
          <h3 className='text-xl font-black uppercase tracking-tighter text-black leading-tight mb-3 hover:text-red-700 transition-colors'>
            {event.title}
          </h3>
        </Link>

        {/* Date + time */}
        <div className='mb-4'>
          <div className='text-2xl font-black uppercase tracking-tighter text-black leading-none'>
            {formatDate(event.event_date)}
          </div>
          <div className='text-sm font-black uppercase tracking-tighter text-gray-400 leading-none mt-1'>
            {timeLabel}
          </div>
        </div>

        <div className='border-t border-gray-100 mb-4' />

        {/* Detail grid */}
        <div className='grid grid-cols-1 gap-3 flex-1 overflow-y-auto'>
          <div>
            <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
              Team Size
            </div>
            <div className='text-sm font-black uppercase tracking-tighter text-black'>
              {event.team_size}
            </div>
          </div>

          <div>
            <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
              Cost
            </div>
            <div className='text-sm font-black uppercase tracking-tighter text-black'>
              {costLabel}
            </div>
          </div>

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

      {/* Register button — pinned to bottom */}
      {event.registration_link ? (
        <Link
          href={event.registration_link}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center justify-center bg-red-700 hover:bg-red-800 text-white text-xs font-black uppercase tracking-widest px-6 py-4 transition-colors duration-300'
        >
          Register Now
        </Link>
      ) : (
        <span className='flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest px-6 py-4 cursor-not-allowed'>
          Registration Closed
        </span>
      )}
    </article>
  );
}
