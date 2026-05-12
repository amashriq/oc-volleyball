import PageHero from "@/app/components/PageHero";

export default function EventLoading() {
  return (
    <main>
      <PageHero src='/images/schedule/oc14edit.JPG' alt='OC Volleyball Action' />

      <div className='max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 relative z-30 mb-20'>
        <div className='bg-white shadow-md p-8 md:p-10'>
          {/* Pills */}
          <div className='flex gap-2 mb-6'>
            <div className='h-7 w-24 bg-gray-200 animate-pulse' />
            <div className='h-7 w-20 bg-gray-200 animate-pulse' />
            <div className='h-7 w-16 bg-gray-200 animate-pulse' />
          </div>

          {/* Date */}
          <div className='h-12 md:h-16 w-56 bg-gray-200 animate-pulse mb-1' />
          <div className='h-6 w-32 bg-gray-200 animate-pulse mb-8' />

          {/* Description */}
          <div className='space-y-2 mb-8'>
            <div className='h-4 w-full bg-gray-200 animate-pulse' />
            <div className='h-4 w-5/6 bg-gray-200 animate-pulse' />
            <div className='h-4 w-3/4 bg-gray-200 animate-pulse' />
          </div>

          <div className='border-t border-gray-100 mb-8' />

          {/* Detail grid */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-1'>
                <div className='h-3 w-16 bg-gray-200 animate-pulse' />
                <div className='h-4 w-20 bg-gray-200 animate-pulse' />
              </div>
            ))}
          </div>

          {/* Button */}
          <div className='h-14 w-full bg-gray-200 animate-pulse' />
        </div>
      </div>
    </main>
  );
}
