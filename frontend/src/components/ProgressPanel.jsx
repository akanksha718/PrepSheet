export default function ProgressPanel() {
  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-lg shadow p-5 space-y-4">

        <h3 className="text-lg font-semibold">Your Progress</h3>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Completed</span>
            <span>12 / 40</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-orange-500 h-2 rounded w-[30%]"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-100 p-3 rounded">Easy: 6</div>
          <div className="bg-gray-100 p-3 rounded">Medium: 4</div>
          <div className="bg-gray-100 p-3 rounded">Hard: 2</div>
        </div>

        <button className="w-full bg-orange-500 text-white py-2 rounded">
          Continue
        </button>

      </div>
    </div>
  );
}
