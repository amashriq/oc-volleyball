import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export function buildEventSitemapEntries(
  events: { id: number | string; updated_at: string | null }[],
): MetadataRoute.Sitemap {
  return events.map((event) => ({
    url: `${SITE_URL}/schedule/${event.id}`,
    lastModified: event.updated_at ?? undefined,
  }));
}
