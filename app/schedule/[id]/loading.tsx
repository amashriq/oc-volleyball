import PageHero from "@/app/components/PageHero";

export default function EventDetailLoading() {
  return (
    <main>
      <PageHero src='/images/schedule/oc14edit.JPG' alt='OC Volleyball Action'>
        <div className='max-w-7xl mx-auto px-6 w-full'>
          <div className='h-10 w-64 bg-white/20 rounded' />
        </div>
      </PageHero>

      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30 mb-20'>
        <div className='bg-white shadow-md p-8 md:p-10'>
          {/* Pills + skill badges */}
          <div className='flex items-start justify-between gap-4 mb-6'>
            <div className='flex flex-wrap gap-2'>
              <div className='h-7 w-24 bg-gray-200 rounded' />
              <div className='h-7 w-16 bg-gray-200 rounded' />
              <div className='h-7 w-16 bg-gray-200 rounded' />
            </div>
            <div className='flex flex-wrap gap-1.5'>
              <div className='h-7 w-10 bg-gray-200 rounded' />
              <div className='h-7 w-10 bg-gray-200 rounded' />
            </div>
          </div>

          {/* Date + time */}
          <div className='flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-4 mb-3'>
            <div className='h-12 w-56 bg-gray-200 rounded' />
            <div className='h-7 w-36 bg-gray-200 rounded' />
          </div>

          {/* Description */}
          <div className='mb-8 flex flex-col gap-2'>
            <div className='h-4 w-full bg-gray-200 rounded' />
            <div className='h-4 w-full bg-gray-200 rounded' />
            <div className='h-4 w-2/3 bg-gray-200 rounded' />
          </div>

          <div className='border-t border-gray-100 mb-8' />

          {/* Detail grid */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
            {["Team Size", "Cost", "Location"].map((label) => (
              <div key={label} className='flex gap-3'>
                <div>
                  <div className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5'>
                    {label}
                  </div>
                  <div className='h-4 w-20 bg-gray-200 rounded' />
                </div>
              </div>
            ))}
          </div>

          {/* Register button */}
          <div className='h-14 w-full bg-gray-200 rounded' />
        </div>
      </div>
    </main>
  );
}
