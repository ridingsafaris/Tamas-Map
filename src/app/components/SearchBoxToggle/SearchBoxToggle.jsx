// Core
import { useState, useRef } from "react";

// Context
import { useMapData } from '../../context/MapDataContext';

const SearchBoxToggle = () => {
  
  // Context
  const { setIsFilterBoxVisible, setIsFilterToggleVisible } = useMapData();
  
  const toggleFilterBox = () => {
    setIsFilterToggleVisible(false);
    setIsFilterBoxVisible(true);
  }

  return (
    <div className="flex items-center w-10 h-16 bg-white absolute top-36 rounded-tr-lg rounded-br-lg cursor-pointer text-gray-600" onClick={toggleFilterBox}>
      <span class="flex text-md rotate-[-90deg] tracking-wide ml-[-5]">Filters</span>
    </div>
  )
}
export default SearchBoxToggle;