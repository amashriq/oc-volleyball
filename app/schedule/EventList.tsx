"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

    // Determine the "Category" suffix
    // If "All" is selected, we just say "Events"
    const categorySuffix = filter === "All" ? "Events" : filter;

    return `${timePrefix} ${categorySuffix}`;
  };

  return (
    <div className='relative h-70 md:h-112.5 w-full'>
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
        <h1 className='text-white text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.9]'>
          {getHeaderTitle()}
        </h1>
      </div>
    </div>
  );
}
