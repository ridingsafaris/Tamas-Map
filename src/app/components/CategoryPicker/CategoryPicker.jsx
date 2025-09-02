"use client"

// Icons
import { CheckIcon } from "@heroicons/react/20/solid";

const CategoryPicker = ({options, values, onChange}) => {

  const toggleCategory = (category) => {
    onChange?.(category.toUpperCase());
  };

  return (
    <div className="p-2">
    <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
      {options.map((category) => {
        const isSelected = values.includes(category.toUpperCase());
        return (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`Toggle ${category} category`}          
            className={`
              flex items-center gap-1 px-3 py-2 rounded-full border text-xs font-medium transition cursor-pointer
              ${isSelected
                ? "bg-[#000] text-white border-gray-600"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"}
            `}
          >
            {isSelected && <CheckIcon className="w-4 h-4" />}
            {category}
          </button>
        );
      })}
    </div>
    </div>
  );
};

export default CategoryPicker;
