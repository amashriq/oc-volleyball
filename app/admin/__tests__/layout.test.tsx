import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLayout from "@/app/admin/layout";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("../../../lib/supabase-browser", () => ({
  supabase: {
    auth: { signOut: jest.fn().mockResolvedValue({}) },
  },
}));

jest.mock("next/link", () =>
  function MockLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  }
);

import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

const mockUsePathname = usePathname as jest.Mock;
const mockSignOut = supabase.auth.signOut as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockSignOut.mockResolvedValue({});
});

describe("AdminLayout", () => {
  describe("on dashboard paths", () => {
    beforeEach(() => {
      mockUsePathname.mockReturnValue("/admin");
    });

    it("renders the Sign Out button", () => {
      render(<AdminLayout><div>content</div></AdminLayout>);
      expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    });

    it("renders Schedule and Merch tabs", () => {
      render(<AdminLayout><div>content</div></AdminLayout>);
      expect(screen.getByRole("link", { name: /schedule/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /merch/i })).toBeInTheDocument();
    });

    it("renders children", () => {
      render(<AdminLayout><div>my content</div></AdminLayout>);
      expect(screen.getByText("my content")).toBeInTheDocument();
    });

    it("calls supabase.auth.signOut on click", async () => {
      render(<AdminLayout><div>content</div></AdminLayout>);
      await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it("redirects to /admin/login after sign out", async () => {
      render(<AdminLayout><div>content</div></AdminLayout>);
      await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
      await screen.findByRole("button", { name: /sign out/i });
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });

    it("redirects only after signOut resolves", async () => {
      let resolve!: () => void;
      mockSignOut.mockReturnValueOnce(new Promise<void>((res) => { resolve = res; }));
      render(<AdminLayout><div>content</div></AdminLayout>);
      await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
      expect(mockPush).not.toHaveBeenCalled();
      resolve();
      await screen.findByRole("button", { name: /sign out/i });
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });
  });

  describe("on /admin/merch", () => {
    it("renders the Sign Out button", () => {
      mockUsePathname.mockReturnValue("/admin/merch");
      render(<AdminLayout><div>content</div></AdminLayout>);
      expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    });
  });

  describe("on non-dashboard paths", () => {
    it("does not render the Sign Out button on event edit page", () => {
      mockUsePathname.mockReturnValue("/admin/events/1/edit");
      render(<AdminLayout><div>edit form</div></AdminLayout>);
      expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
    });

    it("does not render the Sign Out button on new event page", () => {
      mockUsePathname.mockReturnValue("/admin/events/new");
      render(<AdminLayout><div>new form</div></AdminLayout>);
      expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
    });

    it("renders only children on non-dashboard paths", () => {
      mockUsePathname.mockReturnValue("/admin/events/new");
      render(<AdminLayout><div>child only</div></AdminLayout>);
      expect(screen.getByText("child only")).toBeInTheDocument();
      expect(screen.queryByText(/schedule/i)).not.toBeInTheDocument();
    });
  });
});
