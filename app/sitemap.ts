import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { buildEventSitemapEntries } from "@/lib/sitemap-entries";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: events } = await supabase
    .from("events")
    .select("id, updated_at")
    .eq("is_active", true);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/schedule`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...buildEventSitemapEntries(events ?? []),
  ];
}
