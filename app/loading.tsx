import Link from "next/link";
import PageHero from "./components/PageHero";

export default function HomeLoading() {
  return (
    <main>
      <PageHero
        src='/images/hero/hero1.JPG'
        alt='OC Volleyball Action'
        contentPosition='top'
        heightClass='h-150 md:h-150'
      >
        <h1 className='page-heading'>
          OUTTA
          <br />
          CONTROL
          <br />
          VOLLEYBALL
        </h1>
      </PageHero>

      <section className='max-w-7xl mx-auto px-6 py-6'>
        <div className='flex justify-between items-baseline mb-6'>
          <h2 className='text-2xl font-black uppercase tracking-tighter text-black'>
            Upcoming Events
          </h2>
          <Link
            href='/schedule'
            className='text-xs font-black uppercase tracking-widest text-red-700'
          >
            View All →
          </Link>
        </div>

        <div className='-mx-6 px-6 flex gap-4 overflow-x-hidden md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6'>
          {[0, 1, 2].map((i) => (
            <article
              key={i}
              className='w-[82vw] md:w-auto md:min-w-0 shrink-0 bg-white shadow-md flex flex-col h-120 md:h-120'
            >
              <div className='flex flex-col flex-1 p-6 overflow-hidden'>
                <div className='flex flex-wrap gap-1.5 mb-3'>
                  <div className='h-5 w-20 bg-gray-200 rounded' />
                  <div className='h-5 w-14 bg-gray-200 rounded' />
                  <div className='h-5 w-12 bg-gray-200 rounded' />
                </div>

                <div className='h-6 w-3/4 bg-gray-200 rounded mb-1' />
                <div className='h-6 w-1/2 bg-gray-200 rounded mb-3' />

                <div className='mb-4'>
                  <div className='h-7 w-40 bg-gray-200 rounded mb-1' />
                  <div className='h-4 w-24 bg-gray-200 rounded' />
                </div>

                <div className='border-t border-gray-100 mb-4' />

                <div className='grid grid-cols-1 gap-3 flex-1'>
                  <div>
                    <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                      Team Size
                    </div>
                    <div className='h-4 w-10 bg-gray-200 rounded' />
                  </div>
                  <div>
                    <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                      Cost
                    </div>
                    <div className='h-4 w-16 bg-gray-200 rounded' />
                  </div>
                  <div>
                    <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                      Location
                    </div>
                    <div className='h-4 w-32 bg-gray-200 rounded' />
                  </div>
                </div>
              </div>

              <div className='h-12 bg-gray-200' />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
