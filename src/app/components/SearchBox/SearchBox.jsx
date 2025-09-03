// Core
import { useState, useEffect, useRef } from "react";

// Icons
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Components
import SuggestionContainer from "../SuggestionContainer/SuggestionContainer";

// Context
import { useMapData } from '../../context/MapDataContext';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const SearchBox = () => {

  // Local state variables for predictive search and geocoding
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Refs

  const ridesRef = useRef([]);

  // Context variables
  const { 
    isFilterBoxVisible,
    setIsFilterBoxVisible,
    suggestionsVisible,
    setSuggestionsVisible,
    setSelectedGeocode,
    isSuggestionSelected,
    setIsSuggestionSelected,
    setSelectedRide,
    ridesGeojson,
    setClickedRide,
    mapWasClicked,
    setMapWasClicked
  } = useMapData();

  // Helpers

  const getAllSuggestions = () => {
    if (!suggestions) return [];
    return [
      ...suggestions.geocodes.map((s) => ({ type: "geocode", value: s })),
      ...suggestions.rides.map((s) => ({ type: "ride", value: s })),
    ];
  };  

  // Event handlers
  const filterIconClickedHandler = () => {
    setSuggestionsVisible(false);
    setIsFilterBoxVisible(!isFilterBoxVisible);
  }
  const resultSelectedHandler = (item) => {
    setIsSuggestionSelected(true);

    // Get the feature of the ride from the stored records using the ID
    const selected = ridesGeojson.features.filter(feature => feature.id === item.id);
    selected[0].properties.category = JSON.stringify(selected[0].properties.category);
    selected[0].properties.riding_level = JSON.stringify(selected[0].properties.riding_level);
    selected[0].properties.months = JSON.stringify(selected[0].properties.months);


    setSelectedRide(selected[0]);

    //  This fires up the popup anchored at the locations
    setClickedRide({"clickPos": selected[0].geometry.coordinates, "feature": selected[0]});

    setSuggestionsVisible(false);
    setQuery(item.name);
  }
  const locationSelectedHandler = (geocodeObj) => {
    setIsSuggestionSelected(true);
    setSelectedGeocode(geocodeObj);
    setSuggestionsVisible(false);
    setQuery(geocodeObj.place_name);
    setSuggestionsVisible(false);
    setClickedRide(null);
  } 
  
  const resetQueryHandler = () => {
    setQuery("");
    setIsSuggestionSelected(false);
  }
  
  const handleKeyDown = (e) => {
    const allSuggestions = getAllSuggestions();
    if (allSuggestions.length === 0) return;
  
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < allSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : allSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = allSuggestions[highlightedIndex];
      if (!selected) return;
  
      if (selected.type === "ride") {
        resultSelectedHandler(selected.value);
      } else if (selected.type === "geocode") {
        locationSelectedHandler(selected.value);
      }
    }
  };  

  // Hooks
  
  useEffect(() => {
    
    if(isSuggestionSelected) { return; }

    // Throttle/debounce input updates (300ms)

    const handler = setTimeout(() => {
      setDebouncedQuery(query);      
    }, 300);

    return () => clearTimeout(handler);

  }, [query]);

  useEffect(() => {

    // Update suggestions when debounced query changes    
  
    const fetchSuggestions = async () => {
      if(debouncedQuery === "") {
        setSuggestionsVisible(false);
        setSuggestions(null);
        return;
      }

      if (debouncedQuery.trim()) {
        const filtered = ridesRef.current.filter((item) => {
          console.log(item);
          return item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        });

        // Get only the top 3
        const slicedData = filtered.slice(0, 3);
  
        let mapboxResults = [];

        try {
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedQuery)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=3`);
          const data = await response.json();
          console.log(data);

          mapboxResults = data.features.map((f) => {
            return {
              "latlng": f.center,
              "place_name": f.place_name,
              "bbox": f.bbox  
            }
          });

          let combinedResults = {
            "rides": slicedData,
            "geocodes": mapboxResults
          }

          setSuggestions(combinedResults);
          setSuggestionsVisible(true);

        } catch (error) {
          console.error("Mapbox geocoding error:", error);
        }   
      
      } else {
        setSuggestions(null);
      }      
      
      
    };

    fetchSuggestions();

  }, [debouncedQuery]);
  
  useEffect(() => {
    // Build the ridesRef that powers the ride autocomplete suggestions as a source
    if(ridesGeojson === null || ridesRef.current.length > 0) return;
    ridesRef.current = ridesGeojson.features.map((feature) => {
      return {"id": feature.id, "name": feature.properties.name}
    })
  }, [ridesGeojson]);

  useEffect(() => {
    if(mapWasClicked === true) {
      setQuery("");
      setSuggestionsVisible(false);
      setSelectedRide(null);
      setSelectedGeocode(null);
      setIsSuggestionSelected(false);

      // Set the flag back to its default
      setMapWasClicked(false);
    }
  }, [mapWasClicked]);
  
  return (
      <div className="absolute w-full lg:w-1/2 z-20">
        <div className="backdrop-blur-lg relative flex items-center bg-white/10 rounded-2xl shadow-md border border-gray-300/50">
          {/* Magnifying glass */}
          <MagnifyingGlassIcon className="h-6 w-6 text-white absolute left-3 pointer-events-none" />

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a ride or location..."
            className="w-full text-[12px] text-white placeholder-white pl-10 pr-10 py-2 rounded-lg focus:outline-none"
          />

          {/* Adjustments button */}
          {query && query !== "" && (
            <button
              className={`absolute h-full right-10 lg:right-0 p-1 text-white cursor-pointer`}
              onClick={resetQueryHandler}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          )}

          {/* Adjustments button */}
          <button
            onClick={filterIconClickedHandler}
            className="lg:hidden absolute h-full right-2 p-1 text-white cursor-pointer"
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </button>
        </div>
        {suggestionsVisible && (
          <SuggestionContainer 
            suggestions={suggestions}
            onResultSelect={resultSelectedHandler}
            onLocationSelect={locationSelectedHandler}
            highlightedIndex={highlightedIndex}
          />
        )}

      </div>
  )
}

export default SearchBox;