"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { get } from "http";

type Event = {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  address: string;
  description: string;
  rules: string | null;
  cost: number;
  cost_unit: string;
  registration_link: string | null;
  image_url: string | null;
};

const EVENT_TYPES = ["All", "Tournaments", "Open Gyms"];

export default function EventList({ events }: { events: Event[] }) {
  // --- 1. STATE ---
  const [viewMode, setViewMode] = useState<"upcoming" | "past">("upcoming");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);

  const PAGE_SIZE = 10;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });

  // --- 2. THE PIPELINE (Filter -> Sort) ---
  const processedEvents = events
    .filter((e) => {
      // Filter by Date
      const isUpcoming = e.date >= today;
      const matchesView = viewMode === "upcoming" ? isUpcoming : !isUpcoming;

      // Filter by Category
      // Logic: Normalize "Tournaments" to "tournament" to match typical DB entries
      const FILTER_TO_DB_TYPE: Record<string, string> = {
        Tournaments: "tournament",
        "Open Gyms": "open gym",
      };

      const matchesCategory =
        filter === "All" || e.type.toLowerCase() === FILTER_TO_DB_TYPE[filter];

      return matchesView && matchesCategory;
    })
    .sort((a, b) => {
      if (viewMode === "upcoming") {
        // Soonest first
        return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      } else {
        // Most recent past first
        return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
      }
    });

  // --- 3. THE SLICE (Pagination) ---
  const totalPages = Math.ceil(processedEvents.length / PAGE_SIZE);
  const displayList = processedEvents.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  // --- 4. RESET HANDLERS ---
  const handleViewChange = (newView: "upcoming" | "past") => {
    setViewMode(newView);
    setCurrentPage(0); // Always reset to page 1 on tab change
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(0); // Always reset to page 1 on category change
  };

  const getHeaderTitle = () => {
    // Determine the "Time" prefix
    const timePrefix = viewMode === "upcoming" ? "Upcoming" : "Past";

    return `${timePrefix}`;
  };

  return (
    <>
      <div className='relative h-70 md:h-150 w-full'>
        {/* 1. Background Image */}
        <Image
          src='/images/schedule/filler_img.jpg'
          alt='OC Volleyball Action'
          fill
          priority
          quality={90}
          className='object-cover'
        />

        {/* 2. Dimming Layer */}
        <div className='absolute inset-0 bg-black/40 z-10' />

        {/* 3. Content */}
        <div className='relative z-20 h-full mx-auto px-6 flex flex-col justify-center'>
          {/* The Dynamic Title */}
          <div className='max-w-6xl mx-auto px-6 w-full'>
            <h1 className='text-white text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9]'>
              {getHeaderTitle()} Events
            </h1>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30'>
        {/* 1. The Info Box (Floating Card) */}
        <div className='bg-white p-8 md:p-10'>
          {" "}
          <h2 className='text-2xl font-black uppercase tracking-tighter text-gray-900 mb-4'>
            Event Schedule
          </h2>
          <p className='text-gray-600 leading-relaxed text-sm md:text-base'>
            Want to see upcoming or past events? Filter between them with the
            buttons below! Click on an event to see additional information.
          </p>
        </div>
      </div>
      {/* --- THE GRID (Sidebar + Main List) --- */}
      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8 mt-8'>
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className='w-full md:w-72 shrink-0'>
          <div className='bg-white p-6'>
            <h3 className='text-xl font-black uppercase tracking-tight mb-6 border-b pb-2 text-black'>
              Filter Events By:
            </h3>

            {/* 1. Status Filter (Upcoming/Past) */}
            <div className='mb-8'>
              <label className='block text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest'>
                Timeframe
              </label>
              <div className='flex flex-col gap-2'>
                {(["upcoming", "past"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleViewChange(mode)}
                    className={`text-left text-sm font-bold uppercase transition-colors flex items-center gap-2 ${
                      viewMode === mode
                        ? "text-red-700"
                        : "text-gray-400 hover:text-black"
                    }`}
                  >
                    <span
                      className={
                        viewMode === mode ? "opacity-100" : "opacity-0"
                      }
                    >
                      •
                    </span>
                    {mode} Events
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Category Filter (Tournaments/Open Gyms) */}
            <div className='mb-8'>
              <label className='block text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest'>
                Event Type
              </label>
              <div className='space-y-3'>
                {EVENT_TYPES.map((type) => (
                  <label
                    key={type}
                    className='flex items-center gap-3 cursor-pointer group'
                  >
                    <input
                      type='radio'
                      name='type-filter'
                      checked={filter === type}
                      onChange={() => handleFilterChange(type)}
                      className='w-4 h-4 accent-red-700 cursor-pointer'
                    />
                    <span
                      className={`text-sm font-bold uppercase ${
                        filter === type
                          ? "text-black"
                          : "text-gray-400 group-hover:text-gray-700"
                      }`}
                    >
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: THE TABLE */}
        <main className='grow'>
          {/* Navy Blue Header Bar */}
          <div className='bg-[#001D3D] text-white p-6 flex justify-between items-end shadow-md'>
            <h2 className='text-4xl font-black leading-none tracking-tighter'>
              {processedEvents.length} {getHeaderTitle()}{" "}
              {processedEvents.length === 1 ? "Event" : "Events"}
            </h2>
          </div>

          {/* Column Headers */}
          <div className='bg-[#001226] text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-8 py-3 flex'>
            <div className='w-1/4'>Dates</div>
            <div className='w-1/2'>Event & Location</div>
            <div className='w-1/4 text-right'>Register</div>
          </div>

          {/* Event Rows */}
          <div className='bg-white border-x border-b border-gray-200 shadow-sm'>
            {displayList.length > 0 ? (
              displayList.map((event) => (
                <div
                  key={event.id}
                  className='flex flex-col md:flex-row md:items-center px-8 py-8 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group'
                >
                  {/* Column 1: Date */}
                  <div className='w-full md:w-1/4 mb-2 md:mb-0'>
                    <span className='text-sm font-black uppercase tracking-tighter text-black'>
                      {new Date(event.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <span className='block text-[10px] font-bold text-gray-400 mt-1 uppercase'>
                      {event.time}
                    </span>
                  </div>

                  {/* Column 2: Name & Address */}
                  <div className='w-full md:w-1/2 mb-4 md:mb-0'>
                    <h4 className='text-xl font-black uppercase leading-tight mb-1 text-black group-hover:text-red-700 transition-colors'>
                      {event.name}
                    </h4>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wide'>
                      {event.address}
                    </p>
                  </div>

                  {/* Column 3: Registration Link */}
                  <div className='w-full md:w-1/4 text-left md:text-right'>
                    {event.registration_link ? (
                      <Link
                        href={event.registration_link}
                        className='text-xs font-black uppercase tracking-widest text-red-700 border-b-2 border-red-700/20 hover:border-red-700 pb-1 transition-all'
                      >
                        Registration
                      </Link>
                    ) : (
                      <span className='text-xs font-bold uppercase text-gray-300 tracking-widest'>
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='p-20 text-center text-gray-400 italic font-medium'>
                No events found for this selection.
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
