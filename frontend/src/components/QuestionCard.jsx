export default function QuestionCard({ name }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 border-b last:border-b-0">
      <span className="text-sm font-medium">{name}</span>
      <input type="checkbox" className="h-4 w-4 accent-green-600" />
    </div>
  );
}
