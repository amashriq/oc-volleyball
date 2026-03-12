import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function AdminPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <a href='/admin/events/new'>Add New Event</a>
      <ul>
        {events?.map((event) => (
          <li key={event.id}>
            {event.name} — {event.date}
            <a href={`/admin/events/${event.id}/edit`}>Edit</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
