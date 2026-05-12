import Link from "next/link";
import PageHero from "./components/PageHero";

export default function NotFound() {
  return (
    <main>
      <PageHero
        src='/images/hero/hero2.JPG'
        alt='OC Volleyball'
        heightClass='h-screen'
      >
        <div className='text-center'>
          <p className='text-red-500 text-sm font-black uppercase tracking-[0.3em] mb-4'>
            Error 404
          </p>
          <h1 className='text-white text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-none mb-4'>
            Out of
            <br />
            Bounds
          </h1>
          <p className='text-white/70 text-sm md:text-base font-medium mb-10 max-w-xs mx-auto'>
            This page doesn&apos;t exist. Head back and find your game.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link
              href='/'
              className='bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-4 hover:bg-gray-100 transition-colors'
            >
              Home
            </Link>
            <Link
              href='/schedule'
              className='bg-red-700 text-white text-xs font-black uppercase tracking-widest px-8 py-4 hover:bg-red-800 transition-colors'
            >
              View Schedule
            </Link>
          </div>
        </div>
      </PageHero>
    </main>
  );
}
