"use client"

// Components
import { Range } from "react-range";

// Context
import { useMapData } from "../../context/MapDataContext";
import { useFilterData } from "../../context/FilterDataContext";

// Utils
import { currencySymbols } from "../../utils/utils";


const PriceRangeSlider = ({interval, step, min, max, onChange}) => {

  const { selectedCurrency } = useFilterData();
  const { exchangeRates } = useMapData();

  // Handlers
  const valueChangedHandler = (val) => {
    if (onChange) {
      onChange(val);
    }
  }

  // Helpers
  const getConvertedPrice = (value) => {
    try {
      const rate = exchangeRates?.[selectedCurrency]?.USD;
      if (typeof rate !== 'number' || rate <= 0) {
        return "-";
      }
      return parseInt(rate * value);
    } catch (error) {
      console.warn('Currency conversion failed:', error);
      return "-";
    }
  };  

  return (
    <div className="w-full max-w-md mx-auto py-4 px-2">
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
          return (<div
            {...restProps}
            className="h-2 w-full bg-gray-200 rounded"
            style={{ ...restProps.style }}
          >
            <div
              className="h-2 bg-[#000] rounded"
              style={{
                position: "relative",
                left: `${((interval[0] - min) / (max - min)) * 100}%`,
                width: `${((interval[1] - interval[0]) / (max - min)) * 100}%`,
              }}
            />
            {children}
          </div>);
        }}
        renderThumb={({ props, isDragged }) => {     
          const { key, ...restProps } = props;
          return (
            <div key={key} {...restProps}>
              <div className="h-6 w-6 rounded-full bg-white drop-shadow cursor-pointer shadow-sm -translate-y-2" />
            </div>
          )
        }}
      />
      <div className="flex justify-between text-sm text-gray-600 mt-3">
        <div className="text-center">
          <span className="text-xs">Minimum</span>
          <div className="drop-shadow mt-2 p-3 border border-gray-200 rounded-xl">
            <span>
              {currencySymbols[selectedCurrency] ?? ""}
              {getConvertedPrice(interval[0])}
            </span>
          </div>
        </div>
        <div className="text-center">
          <span className="text-xs">Maximum</span>
          <div className="drop-shadow mt-2 p-3 border border-gray-200 rounded-xl">
            <span>
              {currencySymbols[selectedCurrency] ?? ""}
              {getConvertedPrice(interval[1])}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
