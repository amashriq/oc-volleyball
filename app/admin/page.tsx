"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  created_at: string;
};

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (data) setEvents(data);
    }
    fetchEvents();
  }, []);

  async function handleDelete(id: number, imageUrl: string | null) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setDeletingId(id);

    if (imageUrl) {
      const path = imageUrl.split("/event_images/")[1];
      await supabase.storage.from("event_images").remove([path]);
    }

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(error.message);
      setDeletingId(null);
    } else {
      setEvents(events.filter((e) => e.id !== id));
      setDeletingId(null);
    }
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <a href='/admin/events/new'>Add New Event</a>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.name} — {event.date}
            <a href={`/admin/events/${event.id}/edit`}>Edit</a>
            <button
              onClick={() => handleDelete(event.id, event.image_url)}
              disabled={deletingId === event.id}
            >
              {deletingId === event.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
