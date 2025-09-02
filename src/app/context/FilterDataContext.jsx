"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Context
import { useMapData } from './MapDataContext';

const FilterDataContext = createContext();

export const FilterDataProvider = ({ children }) => {
  
  // Context
  const { tripPriceInterval, nightPriceInterval } = useMapData();

  // States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedPriceType, setSelectedPriceType] = useState("NIGHT");
  const [selectedRidingLevel, setSelectedRidingLevel] = useState(null);
  const [selectedPriceInterval, setSelectedPriceInterval] = useState(tripPriceInterval);
  const [blackSaddleSelected, setBlackSaddleSelected] = useState(false);

  useEffect(() => {
    setSelectedPriceInterval(selectedPriceType === "TRIP" ? tripPriceInterval : nightPriceInterval);
  }, [selectedPriceType, tripPriceInterval, nightPriceInterval]);


  return (
    <FilterDataContext.Provider value={{
      selectedMonths, setSelectedMonths,
      selectedCategories, setSelectedCategories,
      selectedCurrency, setSelectedCurrency,
      selectedPriceType, setSelectedPriceType,
      selectedRidingLevel, setSelectedRidingLevel,
      selectedPriceInterval, setSelectedPriceInterval,
      blackSaddleSelected, setBlackSaddleSelected
    }}>
      {children}
    </FilterDataContext.Provider>
  );
};

export const useFilterData = () => useContext(FilterDataContext);