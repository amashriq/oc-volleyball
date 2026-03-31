"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className='inline-flex items-center justify-center 
      px-4 py-2 
      relative 
      font-medium
      text-xl md:text-base /* 20px on mobile, 16px on desktop */
      group'
  >
    {children}
    {/* The Underline - Static Logic */}
    <span
      className='absolute bottom-0 left-0 
      w-full h-0.5 
      bg-black 
      opacity-0
      transition-opacity duration-300 
      group-hover:opacity-100'
    />
  </Link>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className='w-full h-16 md:h-20 bg-white flex items-center px-4 relative z-50'>
        {/* 1. Logo Section (Pinned Left) */}
        <div className='flex-1'>
          <Link href='/'>
            <Image
              src='/images/logo/oc_logo_rbg.png'
              alt='OC Volleyball'
              width={80}
              height={80}
              className='w-16 h-16 md:w-20 md:h-20'
            />
          </Link>
        </div>

        {/* 2. Desktop Links (True Center) */}
        <div className='hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10'>
          <NavLink href='/'>Home</NavLink>
          <NavLink href='/schedule'>Schedule</NavLink>
        </div>

        {/* 3. Mobile Button (Pinned Right) */}
        <div className='flex-1 flex justify-end md:hidden'>
          <button onClick={() => setMenuOpen(!menuOpen)} className='text-2xl'>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay System */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}
      >
        {/* The Dimmer (Backdrop) - Pushed down to top-16 so Nav stays clickable */}
        <div
          className={`absolute inset-0 top-16 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* The Slide-down Menu */}
        {/* -mt-2 overlaps the nav to hide sub-pixel gaps, pt-10 balances the spacing */}
        <div
          className={`absolute top-16 left-0 w-full bg-white shadow-xl -mt-2 pb-6 transition-transform duration-500 ease-in-out flex flex-col items-center gap-2 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <NavLink href='/' onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href='/schedule' onClick={() => setMenuOpen(false)}>
            Schedule
          </NavLink>
        </div>
      </div>
    </>
  );
}
