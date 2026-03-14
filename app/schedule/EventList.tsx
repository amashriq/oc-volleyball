"use client";

import { useState } from "react";

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
  const [filter, setFilter] = useState("All");

  const today = new Date().toISOString().split("T")[0];

  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => {
      if (a.date === b.date) return a.time.localeCompare(b.time);
      return a.date.localeCompare(b.date);
    }); //soonest first

  const past = events
    .filter((e) => e.date < today)
    .sort((a, b) => {
      if (a.date === b.date) return b.time.localeCompare(a.time);
      return b.date.localeCompare(a.date);
    }); //most rescent first

  function filterEvents(list: Event[]) {
    if (filter === "All") return list;
    if (filter === "Tournaments")
      return list.filter((e) => e.type === "tournament");
    if (filter === "Open Gyms")
      return list.filter((e) => e.type === "open gym");
    return list;
  }

  return (
    <div>
      <div>
        {EVENT_TYPES.map((type) => (
          <button key={type} onClick={() => setFilter(type)}>
            {type}
          </button>
        ))}
      </div>

      <h2>Upcoming Events</h2>
      {filterEvents(upcoming).length === 0 && <p>No upcoming events.</p>}
      {filterEvents(upcoming).map((event) => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>
            {event.type} — {event.date} at {event.time}
          </p>
          <p>{event.address}</p>
          <p>
            {event.cost === 0 ? "Free" : `$${event.cost} ${event.cost_unit}`}
          </p>
          <p>{event.description}</p>
          {event.rules && <p>Rules: {event.rules}</p>}
          {event.registration_link && (
            <a href={event.registration_link}>Register</a>
          )}
        </div>
      ))}

      <hr />
      <h2>Past Events</h2>
      {filterEvents(past).length === 0 && <p>No past events.</p>}
      {filterEvents(past).map((event) => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <p>
            {event.type} — {event.date} at {event.time}
          </p>
          <p>{event.address}</p>
          <p>
            {event.cost === 0 ? "Free" : `$${event.cost} ${event.cost_unit}`}
          </p>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
}
