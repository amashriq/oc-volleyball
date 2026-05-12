"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import type { Event } from "@/lib/types";

type TimeFilter = "all" | "upcoming" | "past";
type StatusFilter = "all" | "active" | "hidden";

function today(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

const TYPE_LABELS: Record<Event["event_type"], string> = {
  tournament: "Tournament",
  open_gym: "Open Gym",
};

const SURFACE_LABELS: Record<Event["surface"], string> = {
  indoor: "Indoor",
  grass: "Grass",
  beach: "Beach",
};

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (data) setEvents(data);
    }
    fetchEvents();
  }, []);

  async function handleToggleActive(event: Event) {
    setTogglingId(event.id);
    const { error } = await supabase
      .from("events")
      .update({ is_active: !event.is_active })
      .eq("id", event.id);
    if (!error) {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, is_active: !e.is_active } : e)),
      );
    }
    setTogglingId(null);
  }

  async function handleDelete(id: number, imageUrl: string | null) {
    setDeletingId(id);
    setConfirmDeleteId(null);

    if (imageUrl) {
      const path = imageUrl.split("/event_images/")[1];
      await supabase.storage.from("event_images").remove([path]);
    }

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(error.message);
      setDeletingId(null);
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setDeletingId(null);
    }
  }

  const todayStr = today();

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (timeFilter === "upcoming" && e.event_date < todayStr) return false;
      if (timeFilter === "past" && e.event_date >= todayStr) return false;
      if (statusFilter === "active" && !e.is_active) return false;
      if (statusFilter === "hidden" && e.is_active) return false;
      return true;
    });
  }, [events, timeFilter, statusFilter, todayStr]);

  const totalCount = events.length;
  const upcomingCount = events.filter((e) => e.event_date >= todayStr).length;
  const hiddenCount = events.filter((e) => !e.is_active).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 md:px-8 py-8">

      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Events", value: totalCount },
            { label: "Upcoming", value: upcomingCount },
            { label: "Hidden", value: hiddenCount },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg shadow-md border-l-4 border-[#001D3D] px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{label}</p>
              <p className="text-3xl font-black text-[#001D3D] mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Time</span>
            <div className="flex gap-1">
              {(["upcoming", "past", "all"] as TimeFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer ${
                    timeFilter === f
                      ? "bg-[#001D3D] text-white"
                      : "bg-white text-gray-500 hover:text-[#001D3D] border border-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</span>
            <div className="flex gap-1">
              {(["all", "active", "hidden"] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer ${
                    statusFilter === f
                      ? "bg-[#001D3D] text-white"
                      : "bg-white text-gray-500 hover:text-[#001D3D] border border-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {filtered.length !== events.length && (
            <span className="text-xs text-gray-400 font-medium">
              Showing {filtered.length} of {totalCount}
            </span>
          )}
          <Link
            href="/admin/events/new"
            className="ml-auto shrink-0 bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-widest px-4 py-2 rounded-lg text-xs transition-colors duration-200"
          >
            + Add Event
          </Link>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-300">No events found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#001D3D] text-white">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] w-12">On</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em]">Event</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] hidden md:table-cell">Surface</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((event) => (
                  <tr key={event.id} className={`transition-colors duration-100 ${event.is_active ? "hover:bg-slate-50" : "bg-gray-50 hover:bg-gray-100"}`}>

                    {/* Visibility toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleActive(event)}
                        disabled={togglingId === event.id}
                        title={event.is_active ? "Visible — click to hide" : "Hidden — click to show"}
                        className="relative inline-flex items-center cursor-pointer disabled:opacity-50"
                      >
                        <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${event.is_active ? "bg-[#001D3D]" : "bg-gray-300"}`} />
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${event.is_active ? "translate-x-4" : ""}`} />
                      </button>
                    </td>

                    {/* Title + date */}
                    <td className="px-4 py-4">
                      <p className={`text-sm font-bold leading-tight ${event.is_active ? "text-gray-900" : "text-gray-400"}`}>
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-block bg-[#001D3D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {TYPE_LABELS[event.event_type]}
                      </span>
                    </td>

                    {/* Surface badge */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {SURFACE_LABELS[event.surface]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-xs font-bold uppercase tracking-wider text-[#001D3D] hover:text-red-700 transition-colors duration-150"
                        >
                          Edit
                        </Link>
                        {confirmDeleteId === event.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-400">Sure?</span>
                            <button
                              onClick={() => handleDelete(event.id, event.image_url)}
                              disabled={deletingId === event.id}
                              className="text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-800 px-2 py-1 rounded transition-colors duration-150 cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === event.id ? "..." : "Yes"}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors duration-150 cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(event.id)}
                            className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-700 transition-colors duration-150 cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </main>
  );
}
