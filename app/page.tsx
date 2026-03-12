import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase.from("events").select("*");

  return (
    <main>
      <h1>OC Volleyball</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {error && <p>Error: {error.message}</p>}
    </main>
  );
}
