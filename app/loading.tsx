import PageHero from "./components/PageHero";

function SkeletonCard() {
  return (
    <div className='w-[82vw] md:w-auto shrink-0 bg-white shadow-md flex flex-col h-120'>
      <div className='flex flex-col flex-1 p-6'>
        <div className='flex gap-1.5 mb-3'>
          <div className='h-5 w-20 bg-gray-200 animate-pulse' />
          <div className='h-5 w-14 bg-gray-200 animate-pulse' />
          <div className='h-5 w-16 bg-gray-200 animate-pulse' />
        </div>
        <div className='h-6 w-3/4 bg-gray-200 animate-pulse mb-3' />
        <div className='h-7 w-1/2 bg-gray-200 animate-pulse mb-1' />
        <div className='h-4 w-1/3 bg-gray-200 animate-pulse mb-4' />
        <div className='border-t border-gray-100 mb-4' />
        <div className='space-y-3 flex-1'>
          <div className='h-4 w-1/4 bg-gray-200 animate-pulse' />
          <div className='h-4 w-1/4 bg-gray-200 animate-pulse' />
          <div className='h-4 w-2/4 bg-gray-200 animate-pulse' />
        </div>
      </div>
      <div className='h-12 bg-gray-100 animate-pulse' />
    </div>
  );
}

export default function HomeLoading() {
  return (
    <main>
      <PageHero
        src='/images/hero/hero1.JPG'
        alt='OC Volleyball Action'
        contentPosition='top'
        heightClass='h-150 md:h-150'
      />

      <section className='max-w-7xl mx-auto px-6 py-6'>
        <div className='flex justify-between items-baseline mb-6'>
          <div className='h-6 w-40 bg-gray-200 animate-pulse' />
          <div className='h-4 w-16 bg-gray-200 animate-pulse' />
        </div>
        <div className='flex gap-4 md:grid md:grid-cols-3 md:gap-6'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    </main>
  );
}
