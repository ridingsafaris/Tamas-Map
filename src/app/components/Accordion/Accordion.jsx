"use-client"

// Core
import { useState, useRef, useEffect } from "react";

// Icons
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

// Context
import { useMapData } from "../../context/MapDataContext";
import { useFilterData } from "../../context/FilterDataContext";


// Components
import ThreeWayToggle from "../ThreeWayToggle/ThreeWayToggle";
import TwoWayToggle from "../TwoWayToggle/TwoWayToggle";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import CategoryPicker from "../CategoryPicker/CategoryPicker";
import MonthPicker from "../MonthPicker/MonthPicker";

const AccordionItem = ({ type, title, tooltip, children, isOpen, onToggle }) => {
  const bodyRef = useRef(null);

  const [showPopover, setShowPopover] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(bodyRef.current.scrollHeight + "px");
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return (
    <div>
      <h2
        className="accordion-collapse-heading"
        onClick={onToggle}
      >
        <button
          type="button"
          className={`${type === "top" ? "border-b-1 border-gray-200" : type === "bottom" && !isOpen ? "border-t-0" : "border-b-1 border-gray-200" } flex items-center justify-between w-full p-4 font-medium text-gray-500 hover:bg-[#000]/10 cursor-pointer gap-3`}
        >
          <div className="flex items-center justify-center gap-1 relative">
            <span className="">{title}</span>
            <div 
              className=""
              onMouseMove={(e) => {
                  e.stopPropagation(); // prevent accordion from toggling on hover
                  setShowPopover(true);
              }}
              onMouseLeave={() => setShowPopover(false)}
            >
              <QuestionMarkCircleIcon
                className="mt-1 h-4 w-4 text-gray-400 hover:text-gray-600"            
              />
            </div>
            {showPopover && (
              <div
                className="absolute left-6 top-7 z-10 w-48 rounded-md bg-white shadow-lg border border-gray-200 p-2 text-xs text-gray-600"
                onClick={(e) => e.stopPropagation()} // prevent click from toggling
              >
                {tooltip}
              </div>
            )}                        
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h2>
      <div
        ref={bodyRef}
        style={{ maxHeight }}
        className={`accordion-collapse-body overflow-hidden transition-all duration-300 border-gray-200 ease-in-out ${(type === "bottom" && !isOpen) ? "border-t-0" : (type === "bottom" && isOpen) ? "border-b-0" : (type !== "bottom" && type !== "top" && isOpen) ? "border-b-1" : "border-b-0" } `}
      >
        <div className="">{children}</div>
      </div>
    </div>
  );
};

const Accordion = ({openAccordionIndex}) => {
  const [openIndex, setOpenIndex] = useState(openAccordionIndex !== null ? openAccordionIndex : null);

  const { currencies, priceTypes, ridingLevels, rideMonths, rideCategoriesLong, tripPriceInterval, nightPriceInterval } = useMapData();
  const { 
    selectedMonths, 
    setSelectedMonths,
    selectedCategories,
    setSelectedCategories,
    selectedPriceType, 
    selectedCurrency,
    setSelectedCurrency,
    selectedRidingLevel,
    setSelectedRidingLevel,
    selectedPriceInterval,
    setSelectedPriceInterval,
    setSelectedPriceType
  } = useFilterData();

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const ridingLevelChangedHandler = (level) => {
    setSelectedRidingLevel(level);
  }  

  const monthChangedHandler = (clickedMonth) => {

    setSelectedMonths((prev) => {
      if (prev.includes(clickedMonth.toUpperCase())) {
        return prev.filter((m) => m !== clickedMonth.toUpperCase());
      } else {
        return [...prev, clickedMonth.toUpperCase()];
      }
    });
  }

  const categoryChangedHandler = (category) => {
    setSelectedCategories((prev) => { 
      if (prev.includes(category.toUpperCase())) {
        return prev.filter((c) => c !== category.toUpperCase());
      } else {
        return [...prev, category.toUpperCase()];
      }
    });
  }

  const currencyChangedHandler = (currency) => {
    setSelectedCurrency(currency);
  }  

  const priceTypeChangedHandler = (priceType) => {
    const priceTypeKey = Object.keys(priceTypes).find(
      key => priceTypes[key] === priceType
    ) || null;
    setSelectedPriceType(priceTypeKey);
  }

  const rangeSliderChangedHandler = (interval) => {
    setSelectedPriceInterval(interval);
  } 

  return (
    <div id="accordion-collapse" className="border border-gray-200 rounded-lg">

      <AccordionItem type="top" title="Riding Level" tooltip={`Use the toggle below to choose your ririding level`} isOpen={openIndex === 0} onToggle={() => toggleItem(0)}>
        <div className="w-full p-2">
        <ThreeWayToggle 
          options={ridingLevels}
          value={selectedRidingLevel}
          onChange={ridingLevelChangedHandler} 
        />
        </div>
      </AccordionItem>

      <AccordionItem title="Categories" tooltip={`Select/deselect a number of ride categories by clicking and unclicking the pills below`} isOpen={openIndex === 1} onToggle={() => toggleItem(1)}>
        <CategoryPicker
          options={rideCategoriesLong}
          values={selectedCategories}
          onChange={categoryChangedHandler}
        />
      </AccordionItem>

      <AccordionItem title="Month" tooltip={`Choose which month you are looking to go on a ride`} isOpen={openIndex === 2} onToggle={() => toggleItem(2)}>
        <MonthPicker 
          options={Object.entries(rideMonths).map(month => month[1])}
          values={selectedMonths}
          onChange={monthChangedHandler}
        />
      </AccordionItem> 

      <AccordionItem type="bottom" tooltip={`Select a minimum and maximum amount, and see which ride fits your budget`} title="Price Range" isOpen={openIndex === 3} onToggle={() => toggleItem(3)}>
        <div className="p-2 border-l-0 border-r-0 border-b-0">
          <label className="block text-sm text-gray-500 mt-2 mb-3">Select a currency</label>
          <ThreeWayToggle
            options={Object.keys(currencies)}
            value={selectedCurrency}
            onChange={currencyChangedHandler}
          />           
          <label className="block text-sm text-gray-500 mt-4 mb-3">Show prices on map</label>
          <TwoWayToggle
            options={Object.entries(priceTypes).map(entry => entry[1])}
            value={priceTypes[selectedPriceType]}
            onChange={priceTypeChangedHandler}
          />
          <label className="block mt-4 mb-3 text-sm text-gray-500">Select price range</label>          
          <PriceRangeSlider 
            interval={selectedPriceInterval}
            step={25}
            min={selectedPriceType === "TRIP" ? tripPriceInterval[0] : nightPriceInterval[0]}
            max={selectedPriceType === "TRIP" ? tripPriceInterval[1] : nightPriceInterval[1]}
            onChange={rangeSliderChangedHandler}
          />
        </div>        
      </AccordionItem>                  
    </div>
  );
};

export default Accordion;
