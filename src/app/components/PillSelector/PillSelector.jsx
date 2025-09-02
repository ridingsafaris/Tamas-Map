"use client"
import { useState, useRef, useEffect } from "react";

// Icons
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const PillSelector = ({ options = [], value, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleClick = (option) => {
    if (onChange) {
      onChange(option);
    }
    setOpen(false);
  };

  // Close popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="absolute right-5 inline-block">
      {/* Popover options */}
      {open && (
        <div className="cursor-pointer absolute bottom-full w-26 mb-2 left-1/2 -translate-x-1/2  bg-white shadow-lg rounded-xl border border-gray-200 z-30">
          {options.map((option, idx) => (
            <button
              key={option}
              onClick={() => handleClick(option)}
              className={`cursor-pointer w-full text-center px-2 py-2 text-[10px] font-medium ${idx === 0 ? "hover:rounded-t-lg" : "hover:rounded-b-lg"} 
              hover:bg-[#000]/10 ${value === option ? "text-black font-semibold" : "text-gray-600"}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Pill trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer px-4 py-2 w-26 bg-white border border-gray-300 rounded-full shadow-sm text-[10px] font-semibold text-black hover:bg-gray-50"
      >
        {open ? (
          <ChevronDownIcon className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronUpIcon className="w-3 h-3 text-gray-600" />
        )}        
        {value}
      </button>
    </div>
  );
};

export default PillSelector;
