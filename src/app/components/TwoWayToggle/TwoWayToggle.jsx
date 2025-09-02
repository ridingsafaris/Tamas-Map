"use-client"

const TwoWayToggle = ({ options = [], value, onChange }) => {
    const selectedIndex = options.indexOf(value);

    const handleClick = (option) => {
      if (onChange) {
        onChange(option);
      }
    };    
    return (
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex border border-gray-300 rounded-lg overflow-hidden p-1 shadow-sm">

          {options.map((option, idx) => (
            <div key={option} className="w-1/2 flex items-center">
              <button
                className={`w-full tracking-wide font-semibold px-4 py-2 text-xs cursor-pointer text-gray-700 ${
                  value === option
                    ? "border-gray-600 border-2 rounded rounded-lg"
                    : ""
                }`}
                onClick={() => handleClick(option)}
              >
                {option}
              </button>
              {idx < options.length - 1 &&
                idx !== selectedIndex &&
                idx + 1 !== selectedIndex && (
                  <div className="h-5 border border-gray-200 my-auto"></div>
                )}
            </div>
          ))}

          </div>
        </div>
    )
}
export default TwoWayToggle;