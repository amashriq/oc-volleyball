import { validateEvent, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_LOCATION_LENGTH, MAX_ADDRESS_LENGTH } from "@/lib/validateEvent";

const valid = {
  title: "Summer Open",
  description: "A great event",
  eventDate: "2026-08-01",
  startTime: "09:00",
  location: "OC Sports Center",
  cost: "25",
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

  describe("max length", () => {
    it("accepts a title at exactly the limit", () => {
      expect(validateEvent({ ...valid, title: "a".repeat(MAX_TITLE_LENGTH) })).toBe("");
    });

    it("rejects a title one character over the limit", () => {
      expect(validateEvent({ ...valid, title: "a".repeat(MAX_TITLE_LENGTH + 1) })).toBe(
        `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`
      );
    });

    it("accepts a description at exactly the limit", () => {
      expect(validateEvent({ ...valid, description: "a".repeat(MAX_DESCRIPTION_LENGTH) })).toBe("");
    });

    it("rejects a description one character over the limit", () => {
      expect(validateEvent({ ...valid, description: "a".repeat(MAX_DESCRIPTION_LENGTH + 1) })).toBe(
        `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
      );
    });

    it("accepts a location at exactly the limit", () => {
      expect(validateEvent({ ...valid, location: "a".repeat(MAX_LOCATION_LENGTH) })).toBe("");
    });

    it("rejects a location one character over the limit", () => {
      expect(validateEvent({ ...valid, location: "a".repeat(MAX_LOCATION_LENGTH + 1) })).toBe(
        `Location must be ${MAX_LOCATION_LENGTH} characters or fewer.`
      );
    });

    it("ignores address when it is empty", () => {
      expect(validateEvent({ ...valid, address: "" })).toBe("");
    });

    it("accepts an address at exactly the limit", () => {
      expect(validateEvent({ ...valid, address: "a".repeat(MAX_ADDRESS_LENGTH) })).toBe("");
    });

    it("rejects an address one character over the limit", () => {
      expect(validateEvent({ ...valid, address: "a".repeat(MAX_ADDRESS_LENGTH + 1) })).toBe(
        `Address must be ${MAX_ADDRESS_LENGTH} characters or fewer.`
      );
    });

    it("over-length title error fires before over-length description", () => {
      expect(
        validateEvent({
          ...valid,
          title: "a".repeat(MAX_TITLE_LENGTH + 1),
          description: "a".repeat(MAX_DESCRIPTION_LENGTH + 1),
        })
      ).toBe(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
    });
  });

  describe("cost validation", () => {
    it("accepts zero cost", () => {
      expect(validateEvent({ ...valid, cost: "0" })).toBe("");
    });

    it("accepts a positive decimal cost", () => {
      expect(validateEvent({ ...valid, cost: "25.50" })).toBe("");
    });

    it("accepts a large integer cost", () => {
      expect(validateEvent({ ...valid, cost: "1000" })).toBe("");
    });

    it("rejects empty cost", () => {
      expect(validateEvent({ ...valid, cost: "" })).toBe("Cost is required.");
    });

    it("rejects whitespace-only cost", () => {
      expect(validateEvent({ ...valid, cost: "   " })).toBe("Cost is required.");
    });

    it("rejects non-numeric text", () => {
      expect(validateEvent({ ...valid, cost: "free" })).toBe("Cost must be a valid number.");
    });

    it("rejects partial-numeric text that parseFloat would silently accept", () => {
      expect(validateEvent({ ...valid, cost: "123abc" })).toBe("Cost must be a valid number.");
    });

    it("rejects negative cost", () => {
      expect(validateEvent({ ...valid, cost: "-5" })).toBe("Cost must be 0 or greater.");
    });

    it("rejects negative decimal cost", () => {
      expect(validateEvent({ ...valid, cost: "-0.01" })).toBe("Cost must be 0 or greater.");
    });
  });
});
