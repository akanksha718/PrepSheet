import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "../context/Theme";
export default function Header() {
    const { theme, toggleTheme } = useTheme();
  return (
    <header className="w-full  shadow-md ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/flexicon.svg"   
              alt="Logo"
              className={`h-10 w-10 object-contain ${theme==="light" ? "filter-none" : "filter invert"}`}
            />
            <span className="text-xl font-bold ">
              PrepSheet
            </span>
          </div>
          <button onClick={toggleTheme} className={`h-9 w-9 ${theme==="light" ? "bg-gray-100" : "bg-gray-900"} rounded-full  flex items-center justify-center cursor-pointer`}>
            {theme === "light" ? <IoSunnyOutline className="h-7 w-7 " /> : <IoMoonOutline className="h-7 w-7 " />}
          </button>
        </div>
      </div>
    </header>
  );
}
