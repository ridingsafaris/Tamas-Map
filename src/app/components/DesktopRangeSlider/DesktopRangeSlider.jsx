"use client"

// Core
import React from "react";

// Components
import { Range } from "react-range";

// Context
import { useFilterData } from "../../context/FilterDataContext";
import { useMapData } from "../../context/MapDataContext";


// Utils
import { currencySymbols, getConvertedPrice } from "../../utils/utils";

const DesktopRangeSlider = ({interval, step, min, max, onChange}) => {
    
  const { selectedCurrency } = useFilterData();
  const { exchangeRates } = useMapData();

  // Handlers
  const valueChangedHandler = (val) => {
    if (onChange) {
      onChange(val);
    }
  }   

  return (
    <div className="w-full px-0 py-4 pl-4 pr-8 ">
      <div className="flex items-center justify-between gap-8">

        {/* Min value box */}
        <span className="w-6 text-[#FFF] tracking-wider font-circular text-sm">
          {currencySymbols[selectedCurrency]}{getConvertedPrice(exchangeRates, selectedCurrency, interval[0])}
        </span>

        {/* Slider */}
        <div className="flex-1">
          <Range
            step={step}
            min={min}
            max={max}
            values={interval}
            onChange={valueChangedHandler}
            onFinalChange={valueChangedHandler}
            ariaLabel={["Minimum price", "Maximum price"]}
            renderTrack={({ props, children }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  {...restProps}
                  className="h-0.5 w-full bg-gray-800 rounded"
                >
                  <div
                    className="h-0.5 bg-[#FFF] rounded"
                    style={{
                      position: "relative",
                      left: `${((interval[0] - min) / (max - min)) * 100}%`,
                      width: `${((interval[1] - interval[0]) / (max - min)) * 100}%`,
                    }}
                  />
                  {children}
                </div>
              );
            }}
            renderThumb={({ props, isDragged }) => {
              const { key, ...restProps } = props;
              return (
                <div key={key} {...restProps} style={{
                  ...restProps.style
                }} className={"outline-none shadow-none"}>
                  <div className={`flex items-center justify-center ${isDragged ? 'h-9 w-9' : 'h-6 w-6'} border-[3px] border-[#FFF]/50 bg-[#FFF]/0 rounded-full focus:outline-none focus:ring-0 drop-shadow cursor-pointer shadow-sm -translate-y-0.5`}>
                    <div className="h-2 w-2 rounded-full bg-[#FFF]" />
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* Max value box */}
        <span className="w-6 text-[#FFF] tracking-wider font-circular text-sm">
          {currencySymbols[selectedCurrency]}{getConvertedPrice(exchangeRates, selectedCurrency, interval[1])}
        </span>    

      </div>
    </div>
  );
};

export default DesktopRangeSlider;
