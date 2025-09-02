"use-client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

// Context
import { useMapData } from '../../context/MapDataContext';

// Components
import Accordion from '../../components/Accordion/Accordion'

const FilterBox = ({ }) => {
  
  const { setIsFilterBoxVisible, isFilterBoxVisible, availableRides } = useMapData();

  const closeHandler = () => {
    setIsFilterBoxVisible(false);
  }

  const handleToggleChange = (data) => {
    console.log(data)
  }
  
  return (
    <AnimatePresence>
      {isFilterBoxVisible && (
        <motion.div
          key="filterbox"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="z-30 absolute right-0 top-18 md:top-13 lg:top-20 md:pt-5 w-full md:w-1/2 lg:w-1/4 h-[calc(100%-6rem)] 
          md:h-[calc(100%-5.5rem)] lg:h-[calc(100%-6rem)]"
        >        
          <div className="relative left-0 w-full md:w-full h-[calc(100%-2rem)] px-4 py-0 ">
            <div className="relative w-full h-full bg-white rounded-xl shadow-md border border-gray-300 flex flex-col z-10">
              
              {/* Header row */}
              <div className="flex items-center justify-between pl-4 pr-2 py-2 border-b border-gray-200">
                <h2 className="tracking-wide text-sm font-medium font-semibold text-gray-500">Filters</h2>
                <button
                 onClick={closeHandler}
                 className="py-1 text-gray-500 hover:text-red-500 cursor-pointer"
                 aria-label="Close filters"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Main filter content */}
              <div className="flex-1 w-full scrollbar-hide overflow-y-scroll pl-4 pr-2 py-4">
                {/* You can place your filter controls here */}
              
                <Accordion openAccordionIndex={3} />
              </div>

              <div className="py-4 pl-4 pr-2 w-full">
                <button onClick={closeHandler} className="w-full bg-[#000] text-white font-semibold py-2 px-3 rounded-lg border border-gray-200 hover:bg-[#000] cursor-pointer">
                  Explore {availableRides} rides 
                </button>
              </div>

            </div>
          </div>      
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FilterBox;

