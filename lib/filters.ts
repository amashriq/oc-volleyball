import type { Event } from "@/lib/types";

type FilterCategory<T> = {
  key: string;
  label: string;
  options: string[];
  match: (event: T, selectedOptions: string[]) => boolean;
};

export const FILTER_CATEGORIES: FilterCategory<Event>[] = [
  {
    key: "event_type",
    label: "Event Type",
    options: ["Tournaments", "Open Gyms"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      const DB_MAP: Record<string, string> = {
        Tournaments: "tournament",
        "Open Gyms": "open_gym",
      };
      return selected.some((opt) => event.event_type === DB_MAP[opt]);
    },
  },
  {
    key: "gender",
    label: "Gender",
    options: ["Mens", "Womens", "Coed"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      const DB_MAP: Record<string, string> = {
        Mens: "mens",
        Womens: "womens",
        Coed: "coed",
      };
      return selected.some((opt) => event.gender === DB_MAP[opt]);
    },
  },
  {
    key: "surface",
    label: "Surface",
    options: ["Indoor", "Grass", "Beach"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      const DB_MAP: Record<string, string> = {
        Indoor: "indoor",
        Grass: "grass",
        Beach: "beach",
      };
      return selected.some((opt) => event.surface === DB_MAP[opt]);
    },
  },
  {
    key: "team_size",
    label: "Team Size",
    options: ["6v6", "4v4", "3v3", "2v2"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      return selected.includes(event.team_size);
    },
  },
  {
    key: "skill_level",
    label: "Skill Level",
    options: ["Open", "AA", "A", "BB", "B"],
    match: (event, selected) => {
      if (selected.length === 0) return true;
      if (!event.skill_levels || event.skill_levels.length === 0) return false;
      const DB_MAP: Record<string, string> = {
        AA: "aa",
        BB: "bb",
        A: "a",
        B: "b",
        Open: "open",
      };
      return selected.some((opt) => event.skill_levels!.includes(DB_MAP[opt]));
    },
  },
];

export function getToday(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}
