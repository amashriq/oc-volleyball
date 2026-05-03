import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import PageHero from "@/app/components/PageHero";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id, title")
    .eq("id", id)
    .single();

  if (!event) notFound();

  return (
    <main>
      <PageHero src='/images/schedule/oc14edit.JPG' alt='OC Volleyball Action'>
        <div className='max-w-7xl mx-auto px-6 w-full'>
          <h1 className='page-heading'>{event.title}</h1>
        </div>
      </PageHero>
    </main>
  );
}
