import PageHero from "../components/PageHero";

export default function ScheduleLoading() {
  return (
    <main>
      <PageHero
        src='/images/schedule/CompressedOc14.JPG'
        alt='OC Volleyball Action'
      >
        <div className='max-w-7xl mx-auto px-6 w-full'>
          <h1 className='page-heading'>Upcoming Events</h1>
        </div>
      </PageHero>

      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30'>
        <div className='bg-white shadow-md p-8 md:p-10'>
          <h2 className='text-2xl font-black uppercase tracking-tighter text-black mb-4'>
            Event Schedule
          </h2>
          <p className='text-black leading-relaxed text-sm md:text-base'>
            Want to see upcoming or past events? Filter between them with the
            buttons below! Click on an event to see additional information.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8 mt-8'>
        {/* Sidebar */}
        <aside className='w-full md:w-72 shrink-0'>
          <div className='bg-white px-6 py-6 shadow-md'>
            <h3 className='hidden md:block text-2xl font-black uppercase tracking-tighter text-black mb-6'>
              Filter Events By
            </h3>

            <div className='mb-4'>
              <p className='block text-md font-black uppercase text-black mb-1'>
                Timeframe
              </p>
              <div className='space-y-3'>
                {["Upcoming Events", "Past Events"].map((label) => (
                  <div key={label} className='flex items-center gap-3'>
                    <div className='w-4 h-4 bg-gray-200 rounded-full' />
                    <span className='text-sm font-bold uppercase text-gray-400'>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { label: "Event Type", options: ["Tournaments", "Open Gyms"] },
              { label: "Gender", options: ["Mens", "Womens", "Coed"] },
              { label: "Surface", options: ["Indoor", "Grass", "Beach"] },
              { label: "Team Size", options: ["6v6", "4v4", "3v3", "2v2"] },
              { label: "Skill Level", options: ["Open", "AA", "A", "BB", "B"] },
            ].map((cat) => (
              <div key={cat.label} className='mb-4'>
                <p className='block text-md font-black uppercase text-black mb-1'>
                  {cat.label}
                </p>
                <div className='space-y-3'>
                  {cat.options.map((option) => (
                    <div key={option} className='flex items-center gap-3'>
                      <div className='w-4 h-4 bg-gray-200 rounded' />
                      <span className='text-sm font-bold uppercase text-gray-400'>
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className='grow'>
          <div className='bg-[#001D3D] text-white p-6 flex items-end shadow-md'>
            <div className='flex items-end gap-3'>
              <div className='h-9 w-8 bg-white/20 rounded' />
              <div className='h-9 w-40 bg-white/20 rounded' />
            </div>
          </div>

          <div className='bg-[#001226] text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-8 py-3 flex'>
            <div className='w-1/4'>Dates</div>
            <div className='w-1/2'>Event &amp; Location</div>
            <div className='w-1/4 text-right'>Register</div>
          </div>

          <div className='bg-white border-x border-b border-gray-200 shadow-sm'>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='flex flex-col md:flex-row md:items-center px-8 py-8 border-b border-gray-100 last:border-0'
              >
                <div className='w-full md:w-1/4 mb-2 md:mb-0'>
                  <div className='h-4 w-24 bg-gray-200 rounded mb-1.5' />
                  <div className='h-3 w-16 bg-gray-200 rounded' />
                </div>

                <div className='w-full md:w-1/2 mb-4 md:mb-0'>
                  <div className='h-5 w-3/4 bg-gray-200 rounded mb-1.5' />
                  <div className='h-3 w-1/2 bg-gray-200 rounded' />
                </div>

                <div className='w-full md:w-1/4 flex md:justify-end'>
                  <div className='h-4 w-20 bg-gray-200 rounded' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
