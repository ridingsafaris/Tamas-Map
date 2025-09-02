"use-client"

// Core
import { useState, useRef } from "react";

// Context
import { useMapData } from '../../context/MapDataContext';
import { useFilterData } from '../../context/FilterDataContext';


// Components
import DesktopRangeSlider from "../DesktopRangeSlider/DesktopRangeSlider";
import PillSelector from "../../components/PillSelector/PillSelector";

const PriceSelectorDesktop = () => {
  const { selectedPriceInterval, setSelectedPriceInterval, selectedCurrency, selectedPriceType, setSelectedPriceType } = useFilterData();
  const { tripPriceInterval, nightPriceInterval, priceTypes, isFilterBoxVisible, setIsFilterBoxVisible } = useMapData();

  const rangeSliderChangedHandler = (interval) => {
    setSelectedPriceInterval(interval);
  }

  const filterButtonClickedHandler = () => {
    setIsFilterBoxVisible(!isFilterBoxVisible);
  } 
  
  const priceTypeChangedHandler = (priceType) => {
    const priceTypeKey = Object.keys(priceTypes).find(
      key => priceTypes[key] === priceType
    ) || null;
    setSelectedPriceType(priceTypeKey);  
  }

  return (
    <div className="hidden lg:block fixed left-0 bottom-10 w-full h-auto bg-[#FFF]/0">
      <div className="absolute w-1/4 top-0 left-0 h-full z-20 flex items-center">
        <PillSelector  
          options={Object.entries(priceTypes).map(entry => entry[1])}
          value={priceTypes[selectedPriceType]}
          onChange={priceTypeChangedHandler}
        />      
      </div>
      <div className="relative top-0 w-1/2 left-1/4">
        <DesktopRangeSlider 
          interval={selectedPriceInterval}
          step={25}
          min={selectedPriceType === "TRIP" ? tripPriceInterval[0] : nightPriceInterval[0]}
          max={selectedPriceType === "TRIP" ? tripPriceInterval[1] : nightPriceInterval[1]}
          onChange={rangeSliderChangedHandler}
        />
      </div>
      <div className="absolute w-1/4 top-0 right-0 h-full z-20 flex items-center">
        <button className="absolute left-5 w-auto border-white py-2 px-4 border border-2 border-white rounded-full text-[10px] text-[#000] 
          bg-white cursor-pointer tracking-wide font-semibold" onClick={filterButtonClickedHandler}>
            All Filters
        </button>      
      </div>
    </div>
  );
}

export default PriceSelectorDesktop;