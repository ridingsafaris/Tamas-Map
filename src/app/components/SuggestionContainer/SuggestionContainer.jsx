// Framer Motion
import { AnimatePresence, motion } from "framer-motion";


const SuggestionContainer = ({suggestions, onResultSelect, onLocationSelect, highlightedIndex}) => {
    
    const geocodeSuggestionClickedHandler = (geocode) => {
      onLocationSelect(geocode);
    }
    const searchResultClickedHandler = (item) => {
      onResultSelect(item);
    }

    return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute h-auto w-full top-12 rounded-lg shadow-md"
      >        
          <div className="bg-white rounded-lg shadow">
            {/* Locations */}
            <div className="mb-3 pt-4">
              <h2 className="px-4 text-xs font-bold text-gray-900 mb-2">Locations</h2>
              <ul>
                {suggestions.geocodes.length > 0 ? (
                  suggestions.geocodes.map((item, idx) => {
                    const globalIdx = idx; // geocodes first
                    const isActive = highlightedIndex === globalIdx;

                    return (<li
                      key={idx}
                      onClick={() => {
                        geocodeSuggestionClickedHandler(item);
                      }}
                      className={`cursor-pointer flex items-center text-xs px-4 py-2 ${
                        isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {item.place_name}
                    </li>)

                  })) : (
                    <li className="cursor-pointer text-gray-500 italic text-xs px-4">No locations found!</li>
                )}                  
              </ul>
            </div>

            {/* Rides */}
            <div className="pb-4">
              <h2 className="text-xs font-bold text-gray-900 mb-2 px-4">Rides</h2>
                <ul>
                {suggestions.rides.length > 0 ? (
                  suggestions.rides.map((item, idx) => {
                    const globalIdx = suggestions.geocodes.length + idx; // rides after geocodes
                    const isActive = highlightedIndex === globalIdx;                    
                    return (
                    <li
                      key={idx}
                      onClick={() => {
                        searchResultClickedHandler(item);
                      }}
                      className={`cursor-pointer flex items-center text-xs px-4 py-2 ${
                        isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </li>
                    )
                  })) : (
                    <li className="cursor-pointer flex-items-center text-gray-500 italic cursor-pointer text-xs px-4 py-2">No rides found!</li>
                  )}                 
                </ul>
            </div>
          </div>        
      </motion.div>
    </AnimatePresence>     
    )
}

export default SuggestionContainer;