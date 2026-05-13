import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventList from "@/app/schedule/EventList";
import type { Event } from "@/lib/types";

// PageHero uses next/image with a real image path — stub it out so tests
// don't need the filesystem or a running Next.js image optimizer.
jest.mock("../../components/PageHero", () =>
  function MockPageHero({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  }
);

function makeEvent(overrides: Partial<Event> & Pick<Event, "id" | "title" | "event_date">): Event {
  return {
    description: "A test event",
    event_type: "tournament",
    gender: "mens",
    surface: "indoor",
    team_size: "6v6",
    skill_levels: ["aa"],
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

const UPCOMING_TOURNAMENT = makeEvent({ id: 1, title: "Summer Open", event_date: "2099-06-01", event_type: "tournament", surface: "indoor", gender: "mens" });
const UPCOMING_OPEN_GYM   = makeEvent({ id: 2, title: "Friday Night Open Gym", event_date: "2099-07-01", event_type: "open_gym", surface: "beach", gender: "coed" });
const PAST_TOURNAMENT     = makeEvent({ id: 3, title: "Winter Classic", event_date: "2020-01-15", event_type: "tournament", surface: "indoor", gender: "womens" });

const ALL_EVENTS = [UPCOMING_TOURNAMENT, UPCOMING_OPEN_GYM, PAST_TOURNAMENT];

describe("EventList", () => {
  describe("upcoming / past toggle", () => {
    it("shows upcoming events and hides past events by default", () => {
      render(<EventList events={ALL_EVENTS} />);
      expect(screen.getByText("Summer Open")).toBeInTheDocument();
      expect(screen.getByText("Friday Night Open Gym")).toBeInTheDocument();
      expect(screen.queryByText("Winter Classic")).not.toBeInTheDocument();
    });

    it("shows past events after clicking the Past radio button", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("radio", { name: /past events/i }));
      expect(screen.getByText("Winter Classic")).toBeInTheDocument();
      expect(screen.queryByText("Summer Open")).not.toBeInTheDocument();
    });
  });

  describe("filter — event type", () => {
    it("hides open gym events when Tournaments is checked", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("checkbox", { name: /tournaments/i }));
      expect(screen.getByText("Summer Open")).toBeInTheDocument();
      expect(screen.queryByText("Friday Night Open Gym")).not.toBeInTheDocument();
    });

    it("hides tournament events when Open Gyms is checked", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("checkbox", { name: /open gyms/i }));
      expect(screen.getByText("Friday Night Open Gym")).toBeInTheDocument();
      expect(screen.queryByText("Summer Open")).not.toBeInTheDocument();
    });
  });

  describe("filter — surface", () => {
    it("hides beach events when Indoor is checked", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("checkbox", { name: /indoor/i }));
      expect(screen.getByText("Summer Open")).toBeInTheDocument();
      expect(screen.queryByText("Friday Night Open Gym")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows a no-results message when no events match", async () => {
      render(<EventList events={ALL_EVENTS} />);
      // Select Beach — neither upcoming event is beach except the open gym, but
      // also select Tournaments so nothing matches.
      await userEvent.click(screen.getByRole("checkbox", { name: /tournaments/i }));
      await userEvent.click(screen.getByRole("checkbox", { name: /beach/i }));
      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });

    it("shows a no-results message when the list is genuinely empty", () => {
      render(<EventList events={[]} />);
      expect(screen.getByText(/no events found/i)).toBeInTheDocument();
    });
  });

  describe("event links", () => {
    it("renders the event title as a link to the detail page", () => {
      render(<EventList events={[UPCOMING_TOURNAMENT]} />);
      const link = screen.getByRole("link", { name: /summer open/i });
      expect(link).toHaveAttribute("href", "/schedule/1");
    });
  });

  describe("reset filters button", () => {
    it("renders a Reset Filters button", () => {
      render(<EventList events={ALL_EVENTS} />);
      expect(screen.getByRole("button", { name: /reset filters/i })).toBeInTheDocument();
    });

    it("clears all checkbox filters when clicked", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("checkbox", { name: /tournaments/i }));
      expect(screen.queryByText("Friday Night Open Gym")).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: /reset filters/i }));
      expect(screen.getByText("Friday Night Open Gym")).toBeInTheDocument();
      expect(screen.getByText("Summer Open")).toBeInTheDocument();
    });

    it("resets the timeframe to upcoming when on past view", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("radio", { name: /past events/i }));
      expect(screen.getByText("Winter Classic")).toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: /reset filters/i }));
      expect(screen.queryByText("Winter Classic")).not.toBeInTheDocument();
      expect(screen.getByText("Summer Open")).toBeInTheDocument();
    });

    it("restores all events after multiple filters are applied then reset", async () => {
      render(<EventList events={ALL_EVENTS} />);
      await userEvent.click(screen.getByRole("checkbox", { name: /tournaments/i }));
      await userEvent.click(screen.getByRole("checkbox", { name: /indoor/i }));
      expect(screen.queryByText("Friday Night Open Gym")).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: /reset filters/i }));
      expect(screen.getByText("Summer Open")).toBeInTheDocument();
      expect(screen.getByText("Friday Night Open Gym")).toBeInTheDocument();
    });
  });
});
