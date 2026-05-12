const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400";

export default function EditEventLoading() {
  return (
    <main className='min-h-screen bg-slate-50 px-4 md:px-8 py-10 md:py-14'>

      <div className='max-w-2xl mx-auto mb-8'>
        <div className='w-12 h-1 bg-red-700 mb-3' />
        <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#001D3D] leading-tight'>
          Edit Event
        </h1>
        <p className='mt-2 text-sm text-gray-400 font-medium'>
          All fields marked <span className='text-red-500'>*</span> must be filled before saving.
        </p>
      </div>

      <div className='max-w-2xl mx-auto flex flex-col gap-6'>

        {/* Basic Info */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Basic Info</h2>
          </div>
          <div className='px-6 py-6 flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Event Title *</span>
              <div className='h-11 w-full bg-gray-200 rounded-lg' />
            </div>
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Description *</span>
              <div className='h-24 w-full bg-gray-200 rounded-lg' />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Classification</h2>
          </div>
          <div className='px-6 py-6 flex flex-col gap-5'>
            {["Event Type", "Gender", "Surface", "Team Size"].map((label) => (
              <div key={label} className='flex flex-col gap-1.5'>
                <span className={labelClass}>{label}</span>
                <div className='h-11 w-full bg-gray-200 rounded-lg' />
              </div>
            ))}
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Skill Levels</span>
              <div className='flex flex-wrap gap-3 pt-1'>
                {["AA", "BB", "A", "B", "Open"].map((level) => (
                  <div key={level} className='flex items-center gap-2'>
                    <div className='w-4 h-4 bg-gray-200 rounded' />
                    <div className='h-4 w-8 bg-gray-200 rounded' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Schedule</h2>
          </div>
          <div className='px-6 py-6 flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Event Date *</span>
              <div className='h-11 w-full bg-gray-200 rounded-lg' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <span className={labelClass}>Start Time *</span>
                <div className='h-11 w-full bg-gray-200 rounded-lg' />
              </div>
              <div className='flex flex-col gap-1.5'>
                <span className={labelClass}>End Time</span>
                <div className='h-11 w-full bg-gray-200 rounded-lg' />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Location</h2>
          </div>
          <div className='px-6 py-6 flex flex-col gap-5'>
            {["Venue / Location *", "Address"].map((label) => (
              <div key={label} className='flex flex-col gap-1.5'>
                <span className={labelClass}>{label}</span>
                <div className='h-11 w-full bg-gray-200 rounded-lg' />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Pricing &amp; Capacity</h2>
          </div>
          <div className='px-6 py-6 flex flex-col gap-5'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <span className={labelClass}>Cost ($)</span>
                <div className='h-11 w-full bg-gray-200 rounded-lg' />
              </div>
              <div className='flex flex-col gap-1.5'>
                <span className={labelClass}>Cost Type</span>
                <div className='h-11 w-full bg-gray-200 rounded-lg' />
              </div>
            </div>
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Capacity</span>
              <div className='h-11 w-full bg-gray-200 rounded-lg' />
            </div>
          </div>
        </div>

        {/* Registration & Media */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Registration &amp; Media</h2>
          </div>
          <div className='px-6 py-6 flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Registration Link</span>
              <div className='h-11 w-full bg-gray-200 rounded-lg' />
            </div>
            <div className='flex flex-col gap-1.5'>
              <span className={labelClass}>Event Image</span>
              <div className='h-40 w-full bg-gray-200 rounded-lg' />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className='bg-white shadow-md rounded-lg border-l-4 border-[#001D3D] overflow-hidden'>
          <div className='px-6 pt-6 pb-4 border-b border-gray-100'>
            <h2 className='text-xs font-black uppercase tracking-[0.2em] text-[#001D3D]'>Visibility</h2>
          </div>
          <div className='px-6 py-6'>
            <div className='flex items-start gap-4'>
              <div className='w-11 h-6 bg-gray-200 rounded-full mt-0.5 shrink-0' />
              <div>
                <p className='text-sm font-bold text-gray-900'>Show on website</p>
                <p className='text-xs text-gray-400 mt-1 leading-relaxed'>
                  When turned on, this event appears on the public schedule page for anyone to see. Turn it off to hide the event without deleting it — handy for drafts or events that are full and no longer need to be listed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className='flex flex-col gap-3 pb-6'>
          <div className='h-14 w-full bg-gray-200 rounded-lg' />
        </div>

      </div>
    </main>
  );
}
