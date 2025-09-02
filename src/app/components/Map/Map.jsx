"use client"

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Context
import { useMapData } from '../../context/MapDataContext';
import { useFilterData } from '../../context/FilterDataContext';

// Components
import MapHeader from '../MapHeader/MapHeader';
import FilterBox from '../FilterBox/FilterBox';
import SearchBoxToggle from '../SearchBoxToggle/SearchBoxToggle'
import CategorySelectorDesktop from '../CategorySelectorDesktop/CategorySelectorDesktop';
import MonthSelectorDesktop from '../MonthSelectorDesktop/MonthSelectorDesktop';
import PriceSelectorDesktop from '../PriceSelectorDesktop/PriceSelectorDesktop';

import RidesLayer from '../Layers/RidesLayer/RidesLayer';
import ClusterLayer from '../Layers/ClusterLayer/ClusterLayer';
import RidePopup from '../RidePopup/RidePopup';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

// Utils
import { normalizePricesFromUSD, currencySymbols } from '../../utils/utils'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  
  // References
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Context
  const { map, setMap, mapReady, setMapReady, isLoading, setIsLoading, isFilterBoxVisible, isFilterToggleVisible, ridesGeojson, 
    setIsFilterToggleVisible, rideMonths, tripPriceInterval, setTripPriceInterval, nightPriceInterval, setNightPriceInterval,
    setAvailableRides, clickedRide, setClickedRide, priceTypes, selectedGeocode, isSuggestionSelected, 
    setIsSuggestionSelected, selectedRide, exchangeRates } = useMapData();
    
  const { selectedMonths, setSelectedMonths, selectedCategories, selectedCurrency, selectedPriceType, selectedRidingLevel, 
    selectedPriceInterval } = useFilterData();
  
  // Expressions

  let priceTextFieldExpression = [
    "case", 
    ["==", ["get", "currency"], "USD"], ["concat", ["literal", currencySymbols.USD], selectedPriceType === "NIGHT" ? ["get", "price_per_night"] : ["get", "price"]],
    ["==", ["get", "currency"], "EUR"], ["concat", ["literal", currencySymbols.EUR], selectedPriceType === "NIGHT" ? ["get", "price_per_night"] : ["get", "price"]],
    ["==", ["get", "currency"], "GBP"], ["concat", ["literal", currencySymbols.GBP], selectedPriceType === "NIGHT" ? ["get", "price_per_night"] : ["get", "price"]],
    ''
  ] 

  // Methods

  const drawRoundedRect = (ctx, x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arc(x + w - radius, y + radius, radius, -Math.PI / 2, 0);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2);
    ctx.lineTo(x + radius, y + h);
    ctx.arc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
    ctx.closePath();
  }

  const addPillboxImageToMap = (map, fillColor, borderColor, imageId = 'pillbox') => {
    // Create a canvas
    const width = 50;
    const height = 24;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
  
    // Outer border
    ctx.fillStyle = borderColor;
    drawRoundedRect(ctx, 0, 0, width, height, 12);
    ctx.fill();

    // Inner background
    ctx.fillStyle = fillColor;
    drawRoundedRect(ctx, 1, 1, width - 2, height - 2, 11);
    ctx.fill();
  
    // Convert to image data
    const imageData = ctx.getImageData(0, 0, width, height);
  
    // Add to mapbox style
    if (map.hasImage(imageId)) {
      map.removeImage(imageId);
    }
    map.addImage(imageId, {
      width: width,
      height: height,
      data: imageData.data,
    });
  }

  // Handlers
  const mapLoadHandler = () => {

    // Image to use for non-Black Saddle affiliated rides
    addPillboxImageToMap(mapRef.current, "#FFF", "#A1A1A1", "white-pillbox");
    
    // Image to use for Black Saddle affiliated rides
    addPillboxImageToMap(mapRef.current, "#3D3D3D", "#000", "black-pillbox");    
  
    // Set these two crucial context props when the map has been loaded
    setMapReady(true);
    setMap(mapRef.current);
    setIsLoading(false);

  }

  const monthClickedHandler = (e) => {
    const clickedMonth = e.target.innerText;
    setSelectedMonths((prev) => {
      if (prev.includes(clickedMonth)) {
        return prev.filter((m) => m !== clickedMonth);
      } else {
        return [...prev, clickedMonth];
      }
    });
  }
  
  const resetClickedRide = () => {
    setClickedRide(null);
  }

  // Hooks
  useEffect(() => {
    if(!mapContainerRef.current) { return }
    if(mapRef.current) { return }
      
    mapRef.current = new mapboxgl.Map({
      "container": mapContainerRef.current,
      "center": [
        process.env.NEXT_PUBLIC_MAPBOX_CENTER_LNG,
        process.env.NEXT_PUBLIC_MAPBOX_CENTER_LAT
      ],
      "zoom": process.env.NEXT_PUBLIC_MAPBOX_ZOOM,
      "pitch": 0,
      "bearing": 0,
      "projection": process.env.NEXT_PUBLIC_MAPBOX_PROJECTION,
      "style": "mapbox://styles/mapbox/standard",
      "config": {
        "basemap": {
          "lightPreset": 'night'
        }
      }
    });
      
    mapRef.current.on("load", mapLoadHandler);

  }, []);

  useEffect(() => {
    if(isFilterBoxVisible === false) {
        setIsFilterToggleVisible(true);
    }
    else
    {
        setIsFilterToggleVisible(false);
    }
  }, [isFilterBoxVisible])
  
  useEffect(() => {

    if( mapReady === false) { return; }    

    if( selectedCategories.length === 0 && selectedMonths.length === 0 && selectedRidingLevel === "") { 
      mapRef.current.getSource('rides-src').setData(ridesGeojson);          
      return 
    }

    const source = mapRef.current.getSource('rides-src');

    // Filter

    const allFeatures = ridesGeojson.features;  

    const selCat = selectedCategories;
    const selMo = selectedMonths;
    const selRl = selectedRidingLevel;

      
      
      const filteredFeatures = allFeatures.filter(f => {
        
        // Categories
        const categoriesLower = typeof f.properties.category === "string" ? JSON.parse(f.properties.category).map(category => category.toLowerCase()) : f.properties.category.map(category => category.toLowerCase());        
        const inputCategories = new Set(selCat.map(s => s.toLowerCase()));
        const hasCategory = selCat.length === 0 ? true : categoriesLower.some(c => inputCategories.has(c));

        // Months
        const monthsLower = typeof f.properties.months === "string" ? JSON.parse(f.properties.months).map(month => month.toLowerCase()) : f.properties.months.map(month => month.toLowerCase());
        const inputMonths = new Set(selMo.map(s => s.toLowerCase()));
        const hasMonth = selMo.length === 0 ? true : monthsLower.some(m => inputMonths.has(m));

        // Riding level
        const ridingLevels = typeof f.properties.riding_level === "string" ? JSON.parse(f.properties.riding_level).map(level => level.toLowerCase())  : f.properties.riding_level.map(level => level.toLowerCase());
        const inputRidingLevel = (selRl === null) ? null : selRl.toLowerCase();
        const hasRidingLevel = inputRidingLevel === null ? true : ridingLevels.includes(inputRidingLevel);

        
        const price = f.properties[selectedPriceType === "TRIP" ? "price" : "price_per_night"];
       
        const isWithinBudget = (price >= selectedPriceInterval[0] && price <= selectedPriceInterval[1])

        return hasCategory && hasMonth && hasRidingLevel && isWithinBudget;        
      });
      
      const priceUpdatedGeojson = normalizePricesFromUSD({"type": "FeatureCollection", "features": filteredFeatures}, selectedCurrency, exchangeRates);
      
      // Updates the result counter
      setAvailableRides(priceUpdatedGeojson.features.length);

      source.setData({
        type: "FeatureCollection",
        features: priceUpdatedGeojson.features
      }); 
      
      mapRef.current.setLayoutProperty('rides-lyr', "text-field", priceTextFieldExpression);

  }, [mapReady, selectedCategories, selectedMonths, selectedCurrency, selectedPriceType, selectedRidingLevel, selectedPriceInterval, ridesGeojson]);

  useEffect(() => {
    if( mapReady === false) { return; }
    if( selectedGeocode === null) { return; }

    if(typeof selectedGeocode.bbox !== "undefined") {
      mapRef.current.fitBounds(selectedGeocode.bbox, {
        "padding": 80,
        "maxZoom": 15,
        "duration": 2000,
        "pitch": 45
      });    
    }
    else if(selectedGeocode.latlng !== null)
    {
      map.easeTo({
        "center": selectedGeocode.latlng,
        "zoom": 12,
        "duration": 2000
      });
    }
    setIsSuggestionSelected(false);
  }, [selectedGeocode]);

  useEffect(() => {
    if( mapReady === false) { return; }
    if( selectedRide === null) { return; }
    // Add 0.75 to the latitude in order to fit the opening popup on all latitudes
    map.easeTo({
      "center": [selectedRide.geometry.coordinates[0], selectedRide.geometry.coordinates[1] + 0.75],
      "zoom": 7,
      "duration": 2000
    });    
    setIsSuggestionSelected(false);
  }, [selectedRide]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute w-full h-full" />
      
      {map && mapReady && <RidesLayer map={map} />}
      {map && mapReady && <ClusterLayer map={map} />}
      {clickedRide && ( <RidePopup map={map} activeFeature={clickedRide} onClose={resetClickedRide}/>) }

      <MapHeader />
      <PriceSelectorDesktop />
      <CategorySelectorDesktop />
      <MonthSelectorDesktop 
        options={Object.entries(rideMonths).map(month => month[1])}
        values={selectedMonths}
        onChange={monthClickedHandler}
      />      
      
      <FilterBox />
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default Map;