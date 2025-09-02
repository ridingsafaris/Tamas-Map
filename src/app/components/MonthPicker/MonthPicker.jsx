"use-client";

// Icons
import { CheckIcon } from "@heroicons/react/20/solid";

const MonthPicker = ({options, values, onChange}) => {
  
  const toggleMonth = (month) => {
    if (onChange) {
      onChange(month);
    }
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto" role="group" aria-label="Filter by month">
        {options && options.map((month) => {
          const isSelected = values?.includes(month.toUpperCase()) || false;
          return (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              aria-pressed={isSelected}

              className={`
                flex items-center justify-center gap-1 px-3 py-2 cursor-pointer rounded-full border text-xs font-medium transition
                ${isSelected
                  ? "bg-[#000] text-white border-gray-600"
                  : "border-gray-400 text-gray-700 hover:bg-gray-100"}
              `}
            >
              {isSelected && <CheckIcon 
                className="w-4 h-4 pointer-events-none" 
                aria-hidden="true"
                focusable="false"
              />}
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthPicker;
