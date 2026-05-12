import { FILTER_CATEGORIES, getToday } from "@/lib/filters";
import type { Event } from "@/lib/types";

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 1,
    title: "Test Event",
    description: "A test event",
    event_type: "tournament",
    gender: "mens",
    surface: "indoor",
    team_size: "6v6",
    skill_levels: ["aa", "bb"],
    event_date: "2099-01-01",
    start_time: "09:00:00",
    end_time: null,
    location: "OC Sports Center",
    address: null,
    cost: 0,
    cost_type: "team",
    capacity: null,
    registration_link: null,
    image_url: null,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    created_by: "user-id",
    ...overrides,
  };
}

function matchFor(key: string) {
  const cat = FILTER_CATEGORIES.find((c) => c.key === key)!;
  return cat.match;
}

// --- event_type ---
describe("event_type filter", () => {
  const match = matchFor("event_type");

  it("passes everything when nothing is selected", () => {
    expect(match(makeEvent({ event_type: "tournament" }), [])).toBe(true);
    expect(match(makeEvent({ event_type: "open_gym" }), [])).toBe(true);
  });

  it("passes a tournament when Tournaments is selected", () => {
    expect(match(makeEvent({ event_type: "tournament" }), ["Tournaments"])).toBe(true);
  });

  it("blocks an open_gym when only Tournaments is selected", () => {
    expect(match(makeEvent({ event_type: "open_gym" }), ["Tournaments"])).toBe(false);
  });

  it("passes an open_gym when Open Gyms is selected", () => {
    expect(match(makeEvent({ event_type: "open_gym" }), ["Open Gyms"])).toBe(true);
  });

  it("passes either type when both are selected", () => {
    expect(match(makeEvent({ event_type: "tournament" }), ["Tournaments", "Open Gyms"])).toBe(true);
    expect(match(makeEvent({ event_type: "open_gym" }), ["Tournaments", "Open Gyms"])).toBe(true);
  });
});

// --- gender ---
describe("gender filter", () => {
  const match = matchFor("gender");

  it("passes everything when nothing is selected", () => {
    expect(match(makeEvent({ gender: "coed" }), [])).toBe(true);
  });

  it("passes the matching gender", () => {
    expect(match(makeEvent({ gender: "womens" }), ["Womens"])).toBe(true);
    expect(match(makeEvent({ gender: "mens" }), ["Mens"])).toBe(true);
    expect(match(makeEvent({ gender: "coed" }), ["Coed"])).toBe(true);
  });

  it("blocks a mismatched gender", () => {
    expect(match(makeEvent({ gender: "mens" }), ["Womens"])).toBe(false);
    expect(match(makeEvent({ gender: "coed" }), ["Mens", "Womens"])).toBe(false);
  });
});

// --- surface ---
describe("surface filter", () => {
  const match = matchFor("surface");

  it("passes everything when nothing is selected", () => {
    expect(match(makeEvent({ surface: "beach" }), [])).toBe(true);
  });

  it("passes the matching surface", () => {
    expect(match(makeEvent({ surface: "beach" }), ["Beach"])).toBe(true);
    expect(match(makeEvent({ surface: "grass" }), ["Grass"])).toBe(true);
    expect(match(makeEvent({ surface: "indoor" }), ["Indoor"])).toBe(true);
  });

  it("blocks a mismatched surface", () => {
    expect(match(makeEvent({ surface: "beach" }), ["Indoor"])).toBe(false);
  });
});

// --- team_size ---
describe("team_size filter", () => {
  const match = matchFor("team_size");

  it("passes everything when nothing is selected", () => {
    expect(match(makeEvent({ team_size: "2v2" }), [])).toBe(true);
  });

  it("passes the exact team size", () => {
    expect(match(makeEvent({ team_size: "2v2" }), ["2v2"])).toBe(true);
    expect(match(makeEvent({ team_size: "4v4" }), ["4v4"])).toBe(true);
  });

  it("blocks a different team size", () => {
    expect(match(makeEvent({ team_size: "6v6" }), ["2v2"])).toBe(false);
  });

  it("passes when team size is in a multi-select", () => {
    expect(match(makeEvent({ team_size: "3v3" }), ["2v2", "3v3"])).toBe(true);
  });
});

// --- skill_level ---
describe("skill_level filter", () => {
  const match = matchFor("skill_level");

  it("passes everything when nothing is selected", () => {
    expect(match(makeEvent({ skill_levels: null }), [])).toBe(true);
    expect(match(makeEvent({ skill_levels: [] }), [])).toBe(true);
  });

  it("blocks an event with null skill_levels when a filter is active", () => {
    expect(match(makeEvent({ skill_levels: null }), ["AA"])).toBe(false);
  });

  it("blocks an event with empty skill_levels when a filter is active", () => {
    expect(match(makeEvent({ skill_levels: [] }), ["AA"])).toBe(false);
  });

  it("passes when the event has a matching skill level", () => {
    expect(match(makeEvent({ skill_levels: ["aa", "bb"] }), ["AA"])).toBe(true);
    expect(match(makeEvent({ skill_levels: ["bb"] }), ["BB"])).toBe(true);
    expect(match(makeEvent({ skill_levels: ["open"] }), ["Open"])).toBe(true);
  });

  it("blocks when no skill_levels overlap with the selection", () => {
    expect(match(makeEvent({ skill_levels: ["a", "b"] }), ["AA", "BB"])).toBe(false);
  });

  it("passes when at least one skill_level overlaps", () => {
    expect(match(makeEvent({ skill_levels: ["aa", "a"] }), ["A", "B"])).toBe(true);
  });
});

// --- getToday ---
describe("getToday", () => {
  it("returns a YYYY-MM-DD formatted string", () => {
    const today = getToday();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns the date set by fake timers", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2030-06-15T12:00:00Z"));
    const today = getToday();
    expect(today).toBe("2030-06-15");
    jest.useRealTimers();
  });
});
