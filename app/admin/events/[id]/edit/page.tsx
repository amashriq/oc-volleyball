"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase-browser";
import EventForm, { type EventInitialValues } from "@/app/components/admin/EventForm";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [fetching, setFetching] = useState(true);
  const [event, setEvent] = useState<EventInitialValues | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setEvent(data as EventInitialValues);
      setFetching(false);
    }
    fetchEvent();
  }, [id]);

  if (fetching) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-bold uppercase tracking-widest text-red-400">Event not found.</p>
      </main>
    );
  }

  return <EventForm mode="edit" eventId={id} initialValues={event} />;
}
