import PageHero from "../components/PageHero";

function SkeletonRow() {
  return (
    <div className='flex flex-col md:flex-row md:items-center px-8 py-8 border-b border-gray-100 last:border-0'>
      <div className='w-full md:w-1/4 mb-2 md:mb-0 space-y-2'>
        <div className='h-4 w-24 bg-gray-200 animate-pulse' />
        <div className='h-3 w-16 bg-gray-200 animate-pulse' />
      </div>
      <div className='w-full md:w-1/2 mb-4 md:mb-0 space-y-2'>
        <div className='h-5 w-3/4 bg-gray-200 animate-pulse' />
        <div className='h-3 w-1/2 bg-gray-200 animate-pulse' />
      </div>
      <div className='w-full md:w-1/4 flex md:justify-end'>
        <div className='h-4 w-20 bg-gray-200 animate-pulse' />
      </div>
    </div>
  );
}

export default function ScheduleLoading() {
  return (
    <>
      <PageHero src='/images/schedule/oc14edit.JPG' alt='OC Volleyball Action' />

      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30'>
        <div className='bg-white shadow-md p-8 md:p-10'>
          <div className='h-6 w-40 bg-gray-200 animate-pulse mb-4' />
          <div className='h-4 w-full bg-gray-200 animate-pulse' />
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8 mt-8'>
        {/* Sidebar skeleton */}
        <aside className='w-full md:w-72 shrink-0'>
          <div className='bg-white shadow-md p-6 space-y-6'>
            <div className='h-6 w-32 bg-gray-200 animate-pulse' />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='space-y-3'>
                <div className='h-4 w-24 bg-gray-200 animate-pulse' />
                <div className='h-3 w-20 bg-gray-200 animate-pulse' />
                <div className='h-3 w-16 bg-gray-200 animate-pulse' />
              </div>
            ))}
          </div>
        </aside>

        {/* Table skeleton */}
        <div className='grow'>
          <div className='bg-[#001D3D] p-6'>
            <div className='h-9 w-40 bg-white/20 animate-pulse' />
          </div>
          <div className='bg-[#001226] px-8 py-3 flex'>
            <div className='w-1/4 h-3 bg-white/20 animate-pulse' />
            <div className='w-1/2 h-3 bg-white/20 animate-pulse ml-4' />
            <div className='w-1/4 h-3 bg-white/20 animate-pulse ml-auto' />
          </div>
          <div className='bg-white border-x border-b border-gray-200 shadow-sm'>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </div>
      </div>
    </>
  );
}
