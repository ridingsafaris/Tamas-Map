"use-client"

const PillTwoWayToggle = ({ options = [], value, onChange }) => {
    const selectedIndex = options.indexOf(value);

    const handleClick = (option) => {
      if (onChange) {
        onChange(option);
      }
    };    
    return (
        <div className="absolute right-5 w-48 flex justify-center items-center z-20 border border-2 border-white rounded-full">


          {options.map((option, idx) => (
            <div key={option} className="w-1/2 flex items-center">
              <button
                className={`${idx === 0 ? 'rounded-l-full' : 'rounded-r-full'} w-full tracking-wide font-semibold px-4 py-2 text-[10px] cursor-pointer ${
                  value === option
                    ? "bg-[#000]  text-white border-white-600 border-r-2"
                    : "bg-white text-[#000]"
                }`}
                onClick={() => handleClick(option)}
              >
                {option}
              </button>
              {idx < options.length - 1 &&
                idx !== selectedIndex &&
                idx + 1 !== selectedIndex && (
                  <div className="h-5 border border-white-200 my-auto"></div>
                )}
            </div>
          ))}

        </div>  
    )
}
export default PillTwoWayToggle;