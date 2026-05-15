"use client";

import Link from "next/link";
import PageHero from "./components/PageHero";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main>
      <PageHero src='/images/hero/hero2.JPG' alt='OC Volleyball' heightClass='h-screen'>
        <div className='text-center'>
          <p className='text-red-500 text-sm font-black uppercase tracking-[0.3em] mb-4'>
            Error 500
          </p>
          <h1 className='text-white text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-none mb-4'>
            Net
            <br />
            Error
          </h1>
          <p className='text-white/70 text-sm md:text-base font-medium mb-10 max-w-xs mx-auto'>
            We hit a snag loading the page. Try again or check the schedule.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={reset}
              className='bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors duration-300'
            >
              Try Again
            </button>
            <Link
              href='/schedule'
              className='bg-red-700 text-white text-xs font-black uppercase tracking-widest px-8 py-4 hover:bg-red-800 transition-colors duration-300'
            >
              View Schedule
            </Link>
          </div>
        </div>
      </PageHero>
    </main>
  );
}
