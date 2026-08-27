import { buildEventSitemapEntries } from "@/lib/sitemap-entries";

describe("buildEventSitemapEntries", () => {
  it("returns an empty array for an empty input", () => {
    expect(buildEventSitemapEntries([])).toEqual([]);
  });

  it("maps a single event to a sitemap entry with the correct url and lastModified", () => {
    const result = buildEventSitemapEntries([
      { id: 42, updated_at: "2026-03-01T12:00:00Z" },
    ]);
    expect(result).toEqual([
      {
        url: "https://oc-volleyball.com/schedule/42",
        lastModified: "2026-03-01T12:00:00Z",
      },
    ]);
  });

  it("maps multiple events, preserving order", () => {
    const result = buildEventSitemapEntries([
      { id: 1, updated_at: "2026-01-01T00:00:00Z" },
      { id: 2, updated_at: "2026-02-01T00:00:00Z" },
      { id: 3, updated_at: "2026-03-01T00:00:00Z" },
    ]);
    expect(result.map((entry) => entry.url)).toEqual([
      "https://oc-volleyball.com/schedule/1",
      "https://oc-volleyball.com/schedule/2",
      "https://oc-volleyball.com/schedule/3",
    ]);
  });

  it("falls back to undefined lastModified when updated_at is null", () => {
    const result = buildEventSitemapEntries([{ id: 7, updated_at: null }]);
    expect(result).toEqual([
      { url: "https://oc-volleyball.com/schedule/7", lastModified: undefined },
    ]);
  });

  it("handles a string id (e.g. bigint serialized as string)", () => {
    const result = buildEventSitemapEntries([
      { id: "9007199254740993", updated_at: "2026-01-01T00:00:00Z" },
    ]);
    expect(result[0].url).toBe(
      "https://oc-volleyball.com/schedule/9007199254740993",
    );
  });

  it("handles a large batch without dropping or reordering entries", () => {
    const events = Array.from({ length: 500 }, (_, i) => ({
      id: i,
      updated_at: "2026-01-01T00:00:00Z",
    }));
    const result = buildEventSitemapEntries(events);
    expect(result).toHaveLength(500);
    expect(result[0].url).toBe("https://oc-volleyball.com/schedule/0");
    expect(result[499].url).toBe("https://oc-volleyball.com/schedule/499");
  });

  it("does not mutate the input array", () => {
    const events = [{ id: 1, updated_at: "2026-01-01T00:00:00Z" }];
    const copy = JSON.parse(JSON.stringify(events));
    buildEventSitemapEntries(events);
    expect(events).toEqual(copy);
  });
});
