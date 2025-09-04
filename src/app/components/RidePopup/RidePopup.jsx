"use client"

// Core
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

// Context
import { useFilterData } from '../../context/FilterDataContext';
import { useMapData } from '../../context/MapDataContext';

// Mapbox
import mapboxgl from 'mapbox-gl'

// Icons
import { XCircleIcon } from "@heroicons/react/24/solid";

// Utils

import { currencySymbols, getConvertedPrice } from '../../utils/utils';


const RidePopup = ({ map, activeFeature, onClose }) => {

  const popupRef = useRef();
  const contentRef = useRef(document.createElement("div"));

  const { currencies, exchangeRates } = useMapData();
  const { selectedCurrency } = useFilterData();

  // Local state
  const [imgLoading, setImgLoading] = useState(true);

  // Handlers

  const closeIconClickedHandler = () => onClose?.();

  // Helpers

  const safeJsonParse = (jsonString, fallback = []) => {
    try {
      return JSON.parse(jsonString || '[]');
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return fallback;
    }
  };  

  // Hooks
  useEffect(() => {
    if (!map) return

    popupRef.current = new mapboxgl.Popup({
      "closeOnClick": false,
      "closeButton": false,
      "className": "ride-popup",
      "anchor": "bottom",
      "offset": {
        'top': [0, 25],
        'top-left': [30, -12],
        'top-right': [-30, -12],
        'bottom': [0, -25],
        'bottom-left': [30, 10],
        'bottom-right': [-30, 10],
        'left': [35, -15],
        'right': [-30, -15]
      }
    })

    return () => {
      popupRef.current.remove()
    }
  }, [])

  // when activeFeature changes, set the popup's location and content, and add it to the map
  useEffect(() => {
    if (!activeFeature || activeFeature === null) return
    
    // reset spinner every time new feature loads
    setImgLoading(true)

    // create a fresh DOM node
    const newContent = document.createElement("div");
    contentRef.current = newContent;    

    popupRef.current
      .setLngLat(activeFeature.clickPos)
      .setDOMContent(contentRef.current)
      .addTo(map)
  }, [activeFeature]);

  // Safely check activeFeature in order to avoid it crashing the app
  if (!activeFeature) {
    return null;
  }  

  const properties = activeFeature?.feature?.properties;

  if (!properties) {
    return null;
  }

  return (
    <>{
      createPortal(
        <div className="max-w-xs h-auto rounded-3xl">
          <div className="w-full h-[190px]">
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-3xl">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              decoding="async"
              className="w-full h-full object-cover rounded-t-3xl"
              src={properties.image_url}
              alt={properties.name}
              onLoad={() => setImgLoading(false)}
              onError={() => setImgLoading(false)}
            />          
          </div>
          <div className="bg-[#FFF] w-full max-h-[210px] rounded-b-3xl p-4">
            <h3 className="text-[#000] font-semibold text-lg">{properties.name}</h3>
            <p className="w-full text-[#888] mt-1">{safeJsonParse(properties.category).join(", ")}</p>
            <p className="w-full text-[#888]">{safeJsonParse(properties.riding_level).join(" | ")}</p>
            <p className="w-full text-[#000] mt-2">
              {properties.description && properties.description.length >= 150 ? properties.description.substring(0, 150) + "..." : properties.description}
            </p>
            <p className="w-full text-[#000] mt-2 text-xs font-semibold">
              { properties.duration > 1 ? 
                `From ${currencySymbols[selectedCurrency]}${getConvertedPrice(exchangeRates, selectedCurrency, properties.price)} for ${properties.duration} nights` : 
                `Day rides from ${currencySymbols[selectedCurrency]}${getConvertedPrice(exchangeRates, selectedCurrency, properties.price)}`}</p>
          </div>
          <a 
            href={properties.isBlackSaddle ? properties.black_saddle_url : properties.url} 
            target="_blank" 
            className="z-50 absolute top-0 left-0 w-full h-full"
          ></a>
          <div className="z-40 absolute h-14 top-[-5] right-1">
            <button className={`z-40 h-full right-0 p-1 text-white cursor-pointer`} onClick={closeIconClickedHandler} aria-label="Close popup">
              <XCircleIcon className="h-8 w-8" />
            </button>            
          </div>          
        </div>,
        contentRef.current
      )
    }</>
  )
}

export default RidePopup;