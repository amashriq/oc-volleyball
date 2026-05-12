import { validateEvent } from "@/lib/validateEvent";

const valid = {
  title: "Summer Open",
  description: "A great event",
  eventDate: "2026-08-01",
  startTime: "09:00",
  location: "OC Sports Center",
};

describe("validateEvent", () => {
  it("returns empty string when all fields are valid", () => {
    expect(validateEvent(valid)).toBe("");
  });

  it("rejects a blank title", () => {
    expect(validateEvent({ ...valid, title: "" })).toBe("Title is required.");
  });

  it("rejects a whitespace-only title", () => {
    expect(validateEvent({ ...valid, title: "   " })).toBe("Title is required.");
  });

  it("rejects a blank description", () => {
    expect(validateEvent({ ...valid, description: "" })).toBe("Description is required.");
  });

  it("rejects a whitespace-only description", () => {
    expect(validateEvent({ ...valid, description: "\t\n" })).toBe("Description is required.");
  });

  it("rejects a missing event date", () => {
    expect(validateEvent({ ...valid, eventDate: "" })).toBe("Event date is required.");
  });

  it("rejects a missing start time", () => {
    expect(validateEvent({ ...valid, startTime: "" })).toBe("Start time is required.");
  });

  it("rejects a blank location", () => {
    expect(validateEvent({ ...valid, location: "" })).toBe("Location is required.");
  });

  it("rejects a whitespace-only location", () => {
    expect(validateEvent({ ...valid, location: "  " })).toBe("Location is required.");
  });

  it("validates fields in order — title error surfaces before description error", () => {
    expect(validateEvent({ ...valid, title: "", description: "" })).toBe("Title is required.");
  });
});
