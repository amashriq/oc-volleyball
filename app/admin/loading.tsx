export default function AdminLoading() {
  return (
    <main className='min-h-screen bg-slate-50 px-4 md:px-8 py-8'>
      <div className='max-w-5xl mx-auto flex flex-col gap-6'>

        {/* Stats Row */}
        <div className='grid grid-cols-3 gap-4'>
          {["Total Events", "Upcoming", "Hidden"].map((label) => (
            <div
              key={label}
              className='bg-white rounded-lg shadow-md border-l-4 border-[#001D3D] px-5 py-4'
            >
              <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
                {label}
              </p>
              <div className='h-9 w-12 bg-gray-200 rounded mt-1' />
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className='flex flex-wrap items-center gap-6'>
          <div className='flex items-center gap-2'>
            <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
              Time
            </span>
            <div className='flex gap-1'>
              {["upcoming", "past", "all"].map((f) => (
                <span
                  key={f}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                    f === "upcoming"
                      ? "bg-[#001D3D] text-white"
                      : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400'>
              Status
            </span>
            <div className='flex gap-1'>
              {["all", "active", "hidden"].map((f) => (
                <span
                  key={f}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                    f === "all"
                      ? "bg-[#001D3D] text-white"
                      : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <span className='ml-auto shrink-0 bg-red-700 text-white font-black uppercase tracking-widest px-4 py-2 rounded-lg text-xs'>
            + Add Event
          </span>
        </div>

        {/* Events Table */}
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='bg-[#001D3D] text-white'>
                <th className='px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] w-12'>
                  On
                </th>
                <th className='px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em]'>
                  Event
                </th>
                <th className='px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] hidden md:table-cell'>
                  Type
                </th>
                <th className='px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] hidden md:table-cell'>
                  Surface
                </th>
                <th className='px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em]'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {[0, 1, 2, 3, 4].map((i) => (
                <tr key={i}>
                  <td className='px-4 py-4'>
                    <div className='w-9 h-5 bg-gray-200 rounded-full' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='h-4 w-40 bg-gray-200 rounded mb-1.5' />
                    <div className='h-3 w-24 bg-gray-200 rounded' />
                  </td>
                  <td className='px-4 py-4 hidden md:table-cell'>
                    <div className='h-5 w-20 bg-gray-200 rounded' />
                  </td>
                  <td className='px-4 py-4 hidden md:table-cell'>
                    <div className='h-5 w-16 bg-gray-200 rounded' />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                      <div className='h-4 w-8 bg-gray-200 rounded' />
                      <div className='h-4 w-12 bg-gray-200 rounded' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
