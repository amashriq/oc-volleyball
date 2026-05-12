"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const TABS = [
  { label: "Schedule", href: "/admin" },
  { label: "Merch", href: "/admin/merch" },
];

const DASHBOARD_PATHS = new Set(["/admin", "/admin/merch"]);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!DASHBOARD_PATHS.has(pathname)) return <>{children}</>;

  return (
    <>
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="pt-8 pb-0">
            <div className="w-8 h-1 bg-red-700 mb-2" />
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#001D3D]">
              Admin
            </h1>
          </div>
          <nav className="flex mt-4 gap-0">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-colors duration-150 ${
                  pathname === tab.href
                    ? "border-red-700 text-[#001D3D]"
                    : "border-transparent text-gray-400 hover:text-[#001D3D]"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </>
  );
}
