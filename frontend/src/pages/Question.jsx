import Header from '../components/Header'
import QuestionList from '../components/Questions'
import ProgressPanel from '../components/ProgressPanel'
import { useTheme } from "../context/Theme";

const Question = () => {
  const { theme } = useTheme();
  return (
    <div className='min-h-screen pb-4'>
      <Header />
      <div className={`min-h-screen ${theme=="light"?"bg-white text-black":"bg-black text-white"}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-3 py-2 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3">
            {/* Main Question List - Full width on mobile, 8 cols on desktop */}
            <div className="col-span-1 lg:col-span-8 order-2 lg:order-1">
              <QuestionList />
            </div>
            
            {/* Progress Panel - Full width on mobile, 4 cols on desktop */}
            <div className={`col-span-1 lg:col-span-4 order-1 lg:order-2 ${theme=="light"?"bg-white text-black":"bg-black text-white"}`}>
              <ProgressPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Question
