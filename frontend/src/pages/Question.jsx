import Header from '../components/Header'
import QuestionList from '../components/Questions'
import ProgressPanel from '../components/ProgressPanel'
import { useTheme } from "../context/Theme";
const Question = () => {
  const { theme } = useTheme();
  return (
    <div className='min-h-screen pb-8'>
      <Header />
      <div className={`min-h-screen ${theme=="light"?"bg-white text-black":"bg-black text-white"}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-1 md:col-span-8 md:order-first">
            <QuestionList />
          </div>
          <div className="col-span-1 md:col-span-4 order-first md:order-last">
            <ProgressPanel />
          </div>

        </div>
      </div>
    </div>
    </div>
  )
}

export default Question
