import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventForm, { type EventInitialValues } from "@/app/components/admin/EventForm";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_LOCATION_LENGTH, MAX_ADDRESS_LENGTH } from "../../../../lib/validateEvent";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../../../../lib/supabase-browser", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: "test.jpg" }, error: null }),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: "https://example.com/test.jpg" } })),
        remove: jest.fn().mockResolvedValue({ error: null }),
      })),
    },
  },
}));

jest.mock("../../../admin/actions", () => ({
  revalidateSchedule: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("next/image", () =>
  function MockImage({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  }
);

const SAMPLE_VALUES: EventInitialValues = {
  title: "Beach Open",
  description: "A beach tournament",
  event_type: "tournament",
  gender: "mens",
  surface: "beach",
  team_size: "2v2",
  skill_levels: ["aa"],
  event_date: "2099-08-01",
  start_time: "09:00",
  end_time: null,
  location: "Bondi Beach",
  address: null,
  cost: 50,
  cost_type: "team",
  capacity: null,
  registration_link: null,
  image_url: null,
  is_active: true,
};

beforeEach(() => {
  mockPush.mockClear();
});

describe("EventForm — close button", () => {
  describe("create mode", () => {
    it("renders a close button with aria-label='Close'", () => {
      render(<EventForm mode="create" />);
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    it("shows the 'Add New Event' heading", () => {
      render(<EventForm mode="create" />);
      expect(screen.getByRole("heading", { name: /add new event/i })).toBeInTheDocument();
    });

    it("navigates to /admin when the close button is clicked", async () => {
      render(<EventForm mode="create" />);
      await userEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });

    it("does not navigate when close button is not clicked", () => {
      render(<EventForm mode="create" />);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("edit mode", () => {
    it("renders a close button with aria-label='Close'", () => {
      render(<EventForm mode="edit" eventId="42" initialValues={SAMPLE_VALUES} />);
      expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    });

    it("shows the 'Edit Event' heading", () => {
      render(<EventForm mode="edit" eventId="42" initialValues={SAMPLE_VALUES} />);
      expect(screen.getByRole("heading", { name: /edit event/i })).toBeInTheDocument();
    });

    it("navigates to /admin when the close button is clicked", async () => {
      render(<EventForm mode="edit" eventId="42" initialValues={SAMPLE_VALUES} />);
      await userEvent.click(screen.getByRole("button", { name: /close/i }));
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/admin");
    });
  });

  describe("character counters", () => {
    it("renders counters for all four text fields when empty", () => {
      render(<EventForm mode="create" />);
      // title and location both have limit 100, description has 1000, address has 200
      const hundredCounters = screen.getAllByText(`0 / ${MAX_TITLE_LENGTH}`);
      expect(hundredCounters).toHaveLength(2); // title + location
      expect(screen.getByText(`0 / ${MAX_DESCRIPTION_LENGTH}`)).toBeInTheDocument();
      expect(screen.getByText(`0 / ${MAX_ADDRESS_LENGTH}`)).toBeInTheDocument();
    });

    it("counter updates as user types into the title field", async () => {
      render(<EventForm mode="create" />);
      const titleInput = screen.getByPlaceholderText("Event Title");
      await userEvent.type(titleInput, "Hello");
      expect(screen.getByText(`5 / ${MAX_TITLE_LENGTH}`)).toBeInTheDocument();
    });

    it("counter updates as user types into the description field", async () => {
      render(<EventForm mode="create" />);
      const descInput = screen.getByPlaceholderText("Describe the event...");
      await userEvent.type(descInput, "Hi");
      expect(screen.getByText(`2 / ${MAX_DESCRIPTION_LENGTH}`)).toBeInTheDocument();
    });

    it("counter reflects initialValues length on load", () => {
      render(<EventForm mode="edit" eventId="42" initialValues={SAMPLE_VALUES} />);
      // SAMPLE_VALUES.title = "Beach Open" (10 chars)
      const titleCounter = screen.getByText(`10 / ${MAX_TITLE_LENGTH}`);
      expect(titleCounter).toBeInTheDocument();
    });

    it("title counter has text-gray-400 class when under the limit", () => {
      render(<EventForm mode="create" />);
      const counter = screen.getAllByText(`0 / ${MAX_TITLE_LENGTH}`)[0];
      expect(counter.className).toContain("text-gray-400");
    });

    it("title counter switches to text-red-500 at the limit", () => {
      const atLimit = { ...SAMPLE_VALUES, title: "a".repeat(MAX_TITLE_LENGTH) };
      render(<EventForm mode="edit" eventId="42" initialValues={atLimit} />);
      const counter = screen.getByText(`${MAX_TITLE_LENGTH} / ${MAX_TITLE_LENGTH}`);
      expect(counter.className).toContain("text-red-500");
      expect(counter.className).not.toContain("text-gray-400");
    });

    it("description counter switches to text-red-500 at the limit", () => {
      const atLimit = { ...SAMPLE_VALUES, description: "a".repeat(MAX_DESCRIPTION_LENGTH) };
      render(<EventForm mode="edit" eventId="42" initialValues={atLimit} />);
      const counter = screen.getByText(`${MAX_DESCRIPTION_LENGTH} / ${MAX_DESCRIPTION_LENGTH}`);
      expect(counter.className).toContain("text-red-500");
    });

    it("address counter shows correctly when address has content", () => {
      const withAddress = { ...SAMPLE_VALUES, address: "123 Main St" };
      render(<EventForm mode="edit" eventId="42" initialValues={withAddress} />);
      expect(screen.getByText(`11 / ${MAX_ADDRESS_LENGTH}`)).toBeInTheDocument();
    });
  });

  describe("cost field inline validation", () => {
    it("shows no error with the default '0' value", () => {
      render(<EventForm mode="create" />);
      expect(screen.queryByText("Cost must be a valid number.")).not.toBeInTheDocument();
      expect(screen.queryByText("Cost must be 0 or greater.")).not.toBeInTheDocument();
    });

    it("shows error when user types non-numeric text", async () => {
      render(<EventForm mode="create" />);
      const costInput = screen.getByPlaceholderText("0");
      await userEvent.clear(costInput);
      await userEvent.type(costInput, "free");
      expect(screen.getByText("Cost must be a valid number.")).toBeInTheDocument();
    });

    it("shows error when user types a negative value", async () => {
      render(<EventForm mode="create" />);
      const costInput = screen.getByPlaceholderText("0");
      await userEvent.clear(costInput);
      await userEvent.type(costInput, "-10");
      expect(screen.getByText("Cost must be 0 or greater.")).toBeInTheDocument();
    });

    it("shows no error when user types a valid positive number", async () => {
      render(<EventForm mode="create" />);
      const costInput = screen.getByPlaceholderText("0");
      await userEvent.clear(costInput);
      await userEvent.type(costInput, "25");
      expect(screen.queryByText("Cost must be a valid number.")).not.toBeInTheDocument();
      expect(screen.queryByText("Cost must be 0 or greater.")).not.toBeInTheDocument();
    });

    it("shows no error when user types zero", async () => {
      render(<EventForm mode="create" />);
      const costInput = screen.getByPlaceholderText("0");
      await userEvent.clear(costInput);
      await userEvent.type(costInput, "0");
      expect(screen.queryByText("Cost must be a valid number.")).not.toBeInTheDocument();
      expect(screen.queryByText("Cost must be 0 or greater.")).not.toBeInTheDocument();
    });

    it("clears the error once user fixes the value", async () => {
      render(<EventForm mode="create" />);
      const costInput = screen.getByPlaceholderText("0");
      await userEvent.clear(costInput);
      await userEvent.type(costInput, "free");
      expect(screen.getByText("Cost must be a valid number.")).toBeInTheDocument();
      await userEvent.clear(costInput);
      await userEvent.type(costInput, "50");
      expect(screen.queryByText("Cost must be a valid number.")).not.toBeInTheDocument();
    });
  });

  describe("button identity", () => {
    it("close button has type='button' so it cannot accidentally submit the form", () => {
      render(<EventForm mode="create" />);
      const closeBtn = screen.getByRole("button", { name: /close/i });
      expect(closeBtn).toHaveAttribute("type", "button");
    });

    it("close button is distinct from the submit button", () => {
      render(<EventForm mode="create" />);
      const buttons = screen.getAllByRole("button");
      const closeBtn = screen.getByRole("button", { name: /close/i });
      const submitBtn = screen.getByRole("button", { name: /create event/i });
      expect(buttons.length).toBeGreaterThanOrEqual(2);
      expect(closeBtn).not.toBe(submitBtn);
    });
  });
});
