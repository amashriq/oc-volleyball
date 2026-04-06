import Image from "next/image";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className='relative h-svh w-full overflow-hidden'>
        {/* Background Image */}
        <Image
          src='/images/hero/hero1.JPG'
          alt='OC Volleyball Action'
          fill
          priority
          quality={90}
          className='object-cover'
        />

        <div className='absolute inset-0 bg-black/40 z-10' />

        {/* 3. The Content (Z-20 ensures it's ON TOP of the image) */}
        <div className='relative z-20 flex flex-col justify-start pt-10 h-full px-5 md:px-10 text-white'>
          <h1 className='text-6xl md:text-8xl font-bold uppercase leading-[0.9] tracking-tighter'>
            OUTTA
            <br />
            CONTROL
            <br />
            VOLLEYBALL
          </h1>
        </div>
      </section>
    </main>
  );
}
