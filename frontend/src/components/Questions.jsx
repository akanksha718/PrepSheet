import { useTheme } from "../context/Theme";
import QuestionCard from "./QuestionCard";

export default function QuestionList() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`
        ${isLight ? "bg-white text-black" : "bg-[#292a2a] text-white"}
        rounded-xl shadow-md p-6 sm:p-8 space-y-5
      `}
    >
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-semibold">
        PrepSheet – Interactive Question Management Sheet
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">
        Increase your productivity by adding questions and topics to your sheet.
        Track your progress and stay organized with ease.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          className={`
            rounded-md px-5 py-2 text-sm font-medium transition
            ${isLight
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-orange-500 text-white hover:bg-orange-600"}
          `}
        >
          + Add Topic
        </button>
      </div>
      {/* Added Topic List */}
    </div>
  );
}
