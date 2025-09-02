"use client"

// Context
import { useFilterData } from '../../context/FilterDataContext';


const MonthSelectorDesktop = ({options, values, onChange}) => {
  
  // Context
  const { setSelectedMonths } = useFilterData();

  const monthClickedHandler = (e) => {
    const clickedMonth = e.target.innerText;
    setSelectedMonths((prev) => {
      if (prev.includes(clickedMonth)) {
        return prev.filter((m) => m !== clickedMonth);
      } else {
        return [...prev, clickedMonth];
      }
    });
  }

  return (
    <div className="backdrop-blur-lg hidden lg:flex lg:flex-col absolute md:top-1/2 md:transform md:-translate-y-1/2 
    right-5 w-auto h-auto mt-7 p-3 bg-[#00000000]/30 flex justify-center rounded-xl">
        {
          options && options.map((month, index) => {
            return (
              <button 
                onClick={monthClickedHandler}
                key={index}
                className={`hover:opacity-100 ${values.indexOf(month.toUpperCase()) > -1 ? "opacity-100 font-semibold" : "opacity-70"} 
                text-right text-[#FFF] font-circular uppercase leading-[2rem] text-[14px] tracking-wider my-1 cursor-pointer`}>
                {month}
              </button>
            )
          })
        }
    </div>
  )
}
export default MonthSelectorDesktop;