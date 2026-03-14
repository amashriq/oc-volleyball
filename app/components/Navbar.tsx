"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <Link href='/'>OC Volleyball</Link>

      {/* Hamburger button - visible on mobile only */}
      <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      {/* Mobile menu */}
      {menuOpen && (
        <div>
          <Link href='/' onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href='/schedule' onClick={() => setMenuOpen(false)}>
            Schedule
          </Link>
        </div>
      )}

      {/* Desktop menu */}
      <div className='desktop-menu'>
        <Link href='/'>Home</Link>
        <Link href='/schedule'>Schedule</Link>
      </div>
    </nav>
  );
}
