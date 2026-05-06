"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "../components/PageHero";
import type { Event } from "@/lib/types";

type FilterCategory<T> = {
  key: string;
  label: string;
  options: string[];
  match: (event: T, selectedOptions: string[]) => boolean;
};

const FILTER_CATEGORIES: FilterCategory<Event>[] = [
  {
    key: "event_type",
    label: "Event Type",
    options: ["Tournaments", "Open Gyms"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      const DB_MAP: Record<string, string> = {
        Tournaments: "tournament",
        "Open Gyms": "open_gym",
      };
      return selected.some((opt) => event.event_type === DB_MAP[opt]);
    },
  },
  {
    key: "gender",
    label: "Gender",
    options: ["Mens", "Womens", "Coed"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      const DB_MAP: Record<string, string> = {
        Mens: "mens",
        Womens: "womens",
        Coed: "coed",
      };
      return selected.some((opt) => event.gender === DB_MAP[opt]);
    },
  },
  {
    key: "surface",
    label: "Surface",
    options: ["Indoor", "Grass", "Beach"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      const DB_MAP: Record<string, string> = {
        Indoor: "indoor",
        Grass: "grass",
        Beach: "beach",
      };
      return selected.some((opt) => event.surface === DB_MAP[opt]);
    },
  },
  {
    key: "team_size",
    label: "Team Size",
    options: ["6v6", "4v4", "3v3", "2v2"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      return selected.includes(event.team_size);
    },
  },
  {
    key: "skill_level",
    label: "Skill Level",
    options: ["Open", "AA", "A", "BB", "B"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      if (!event.skill_levels || event.skill_levels.length === 0) return false;
      const DB_MAP: Record<string, string> = {
        AA: "aa",
        BB: "bb",
        A: "a",
        B: "b",
        Open: "open",
      };
      return selected.some((opt) => event.skill_levels!.includes(DB_MAP[opt]));
    },
  },
];

const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "America/New_York",
});

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function EventList({ events }: { events: Event[] }) {
  // --- 1. STATE ---
  const [viewMode, setViewMode] = useState<"upcoming" | "past">("upcoming");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  // --- 2. THE PIPELINE (Filter -> Sort) ---
  const processedEvents = events
    .filter((e) => {
      // Filter by Date
      const isUpcoming = e.event_date >= today;
      const matchesView = viewMode === "upcoming" ? isUpcoming : !isUpcoming;

      const matchesCategory = FILTER_CATEGORIES.every((cat) => {
        const selected = selectedFilters[cat.key] ?? [];
        return cat.match(e, selected);
      });

      return matchesView && matchesCategory;
    })
    .sort((a, b) => {
      if (viewMode === "upcoming") {
        // Soonest first
        return (
          a.event_date.localeCompare(b.event_date) ||
          a.start_time.localeCompare(b.start_time)
        );
      } else {
        // Most recent past first
        return (
          b.event_date.localeCompare(a.event_date) ||
          b.start_time.localeCompare(a.start_time)
        );
      }
    });

  // --- 3. RESET HANDLERS ---
  const handleViewChange = (newView: "upcoming" | "past") => {
    setViewMode(newView);
  };

  const handleCheckboxChange = (categoryKey: string, option: string) => {
    setSelectedFilters((prev) => {
      const current = prev[categoryKey] ?? [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [categoryKey]: updated };
    });
  };

  const getHeaderTitle = viewMode === "upcoming" ? "Upcoming" : "Past";

  return (
    <>
      <PageHero src='/images/schedule/oc14edit.JPG' alt='OC Volleyball Action'>
        <div className='max-w-7xl mx-auto px-6 w-full'>
          <h1 className='page-heading'>{getHeaderTitle} Events</h1>
        </div>
      </PageHero>

      {/* --- MAIN CONTENT AREA --- */}
      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30'>
        {/* 1. The Info Box (Floating Card) */}
        <div className='bg-white shadow-md p-8 md:p-10'>
          <h2 className='text-2xl font-black uppercase tracking-tighter text-black mb-4'>
            Event Schedule
          </h2>
          <p className='text-black leading-relaxed text-sm md:text-base'>
            Want to see upcoming or past events? Filter between them with the
            buttons below! Click on an event to see additional information.
          </p>
        </div>
      </div>
      {/* --- THE GRID (Sidebar + Main List) --- */}
      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8 mt-8'>
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className='w-full md:w-72 shrink-0'>
          {/* Mobile toggle button */}
          <button
            className='md:hidden w-full bg-white shadow-md px-6 py-4 flex justify-between items-center'
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <h3 className='text-2xl font-black uppercase tracking-tighter text-black'>
              Filter Events
            </h3>
            <span
              className={`text-black text-lg transition-transform duration-300 ease-in-out ${
                filtersOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {/* Collapsible filter panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out shadow-md md:overflow-visible md:max-h-none ${
              filtersOpen ? "max-h-300" : "max-h-0"
            }`}
          >
            <div className='bg-white px-6 md:p-6 shadow-md'>
              <h3 className='hidden md:block text-2xl font-black uppercase tracking-tighter text-black mb-6'>
                Filter Events By
              </h3>

              {/* 1. Status Filter (Upcoming/Past) */}
              <div className='mb-4'>
                <label className='block text-md font-black uppercase text-black mb-1'>
                  Timeframe
                </label>
                <div className='space-y-3'>
                  {(["upcoming", "past"] as const).map((mode) => {
                    const isChecked = viewMode === mode;
                    return (
                      <label
                        key={mode}
                        className='flex items-center gap-3 cursor-pointer group'
                      >
                        <input
                          type='radio'
                          name='timeframe'
                          checked={isChecked}
                          onChange={() => handleViewChange(mode)}
                          className='w-4 h-4 accent-black cursor-pointer'
                        />
                        <span
                          className={`text-sm font-bold uppercase transition-colors duration-300 ${
                            isChecked
                              ? "text-black"
                              : "text-gray-400 group-hover:text-black"
                          }`}
                        >
                          {mode} Events
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Config-driven filter categories */}
              {FILTER_CATEGORIES.map((cat) => (
                <div key={cat.key} className='mb-4'>
                  <label className='block text-md font-black uppercase text-black mb-1'>
                    {cat.label}
                  </label>
                  <div className='space-y-3'>
                    {cat.options.map((option) => {
                      const isChecked = (
                        selectedFilters[cat.key] ?? []
                      ).includes(option);
                      return (
                        <label
                          key={option}
                          className='flex items-center gap-3 cursor-pointer group'
                        >
                          <input
                            type='checkbox'
                            checked={isChecked}
                            onChange={() =>
                              handleCheckboxChange(cat.key, option)
                            }
                            className='w-4 h-4 accent-black cursor-pointer'
                          />
                          <span
                            className={`text-sm font-bold uppercase transition-colors duration-300 ${
                              isChecked
                                ? "text-black"
                                : "text-gray-400 group-hover:text-black"
                            }`}
                          >
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Hide Filters — mobile only */}
              <div className='md:hidden mt-4 pt-4 border-t border-gray-100 text-center'>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className='text-sm w-full font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors duration-300'
                >
                  Hide Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: THE TABLE */}
        <main className='grow'>
          {/* Navy Blue Header Bar */}
          <div className='bg-[#001D3D] text-white p-6 flex justify-between items-end shadow-md'>
            <h2 className='text-4xl font-black leading-none tracking-tighter'>
              {processedEvents.length} {getHeaderTitle}{" "}
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
            {processedEvents.length > 0 ? (
              processedEvents.map((event) => (
                <div
                  key={event.id}
                  className='flex flex-col md:flex-row md:items-center px-8 py-8 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group'
                >
                  {/* Column 1: Date */}
                  <div className='w-full md:w-1/4 mb-2 md:mb-0'>
                    <span className='text-sm font-black uppercase tracking-tighter text-black'>
                      {new Date(
                        event.event_date + "T00:00:00",
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className='block text-[10px] font-bold text-gray-400 mt-1 uppercase'>
                      {formatTime(event.start_time)}
                    </span>
                  </div>

                  {/* Column 2: Name & Location */}
                  <div className='w-full md:w-1/2 mb-4 md:mb-0'>
                    <Link href={`/schedule/${event.id}`}>
                      <h4 className='text-xl font-black uppercase leading-tight mb-1 text-black group-hover:text-red-700 transition-colors'>
                        {event.title}
                      </h4>
                    </Link>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wide'>
                      {event.location}
                    </p>
                  </div>

                  {/* Column 3: Registration Link */}
                  <div className='w-full md:w-1/4 text-left md:text-right'>
                    {event.registration_link ? (
                      <Link
                        href={event.registration_link}
                        target='_blank'
                        rel='noopener noreferrer'
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
