"use client"
import React, { useRef, useEffect, useState } from 'react';

// Context
import { useMapData } from '../../context/MapDataContext';
import { useFilterData } from '../../context/FilterDataContext';

const CategorySelectorDesktop = () => {

  // Context
  const { rideCategoriesShort, nightPriceInterval, tripPriceInterval } = useMapData();
  const { setSelectedRidingLevel, selectedPriceType, setSelectedPriceInterval, selectedCategories, setSelectedCategories, 
    setSelectedMonths, blackSaddleSelected, setBlackSaddleSelected } = useFilterData();

  const categoryClickedHandler = (e) => {
    const clickedCategory = e.target.innerText;
    setSelectedCategories((prev) => {
      if (prev.includes(clickedCategory)) {
        return prev.filter((m) => m !== clickedCategory);
      } else {
        return [...prev, clickedCategory];
      }
    });
  }

  const blackSaddleClickedHandler = () => {
    setSelectedRidingLevel(null);
    setSelectedPriceInterval(selectedPriceType === "TRIP" ? tripPriceInterval : nightPriceInterval);
    setSelectedMonths([]);  

    if(blackSaddleSelected) {
      setSelectedCategories([]);
      setBlackSaddleSelected(false);  
    }
    else
    {
      setSelectedCategories(["BLACK SADDLE"]);
      setBlackSaddleSelected(true);        
    }
  }

  useEffect(() => {
    if(selectedCategories.length === 0) {
      setBlackSaddleSelected(false);
    }
  }, [selectedCategories]);

  return (
    <div className="backdrop-blur-lg hidden lg:flex flex-col absolute md:top-1/2 md:transform md:-translate-y-1/2 left-5 w-auto h-auto 
    mt-7
    p-3 
    bg-[#00000000]/30 flex justify-center rounded-xl">
        {
          rideCategoriesShort.map((category, index) => {
            if(category.toLowerCase() === "black saddle") {
              return (
                <button
                  onClick={blackSaddleClickedHandler}
                  key={index}
                  className={`${blackSaddleSelected ? "opacity-100 font-semibold" : "opacity-70"} hover:opacity-100 text-[#FFF] font-circular 
                  uppercase leading-[2rem] text-[14px] tracking-wider my-1 cursor-pointer text-start`}
                >
                  {category}
                </button>
              )
            }
            else
            {
              return (
                <button
                  onClick={categoryClickedHandler}
                  key={index}
                  className={`hover:opacity-100 ${selectedCategories.indexOf(category.toUpperCase()) > -1 ? "opacity-100 font-semibold" : "opacity-70"} text-[#FFF] font-circular 
                  uppercase leading-[2rem] text-[14px] tracking-wider my-1 cursor-pointer text-start`}
                >
                  {category}
                </button>
              )
            }
          })
        }
    </div>
  )
}
export default CategorySelectorDesktop;