"use-client"

// Core
import { useEffect, useRef } from "react";

// Context
import { useMapData } from '../../../context/MapDataContext';
import { useFilterData } from '../../../context/FilterDataContext';

// Utils
import { currencySymbols } from '../../../utils/utils'

const RidesLayer = ({map}) => {
    
    const initializedRef = useRef(false);

    const { ridesGeojson, setClickedRide, isLoading, setIsLoading, setMapWasClicked } = useMapData();
    const { selectedPriceType } = useFilterData();

    // Expressions

    let priceTextFieldExpression = [
      "case", 
      ["==", ["get", "currency"], "USD"], ["concat", ["literal", currencySymbols.USD], selectedPriceType === "NIGHT" ? ["get", "price_per_night"] : ["get", "price"]],
      ["==", ["get", "currency"], "EUR"], ["concat", ["literal", currencySymbols.EUR], selectedPriceType === "NIGHT" ? ["get", "price_per_night"] : ["get", "price"]],
      ["==", ["get", "currency"], "GBP"], ["concat", ["literal", currencySymbols.GBP], selectedPriceType === "NIGHT" ? ["get", "price_per_night"] : ["get", "price"]],
      ""
    ] 
   

    // Handlers
    const layerClickedHandler = (e) => {
     
      e.originalEvent.preventDefault();

      setIsLoading(true);

      // Assemble the clicked marker data payload
      const clickedRecord = {
        "clickPos": e.features[0].geometry.coordinates,
        "feature": e.features[0]
      }

      setClickedRide(clickedRecord);
      setIsLoading(false);

      // Smoothly move the map to the target location
      map.easeTo({
        "center": [clickedRecord.clickPos[0], clickedRecord.clickPos[1] + 0.75],
        "zoom": 7,
        "duration": 1000
      });

    }
    const mouseOverHandler = () => {
      map.getCanvas().style.cursor = 'pointer';
    }
    const mouseMoveHandler = () => {
      map.getCanvas().style.cursor = 'pointer';
    }    
    const mouseOutHandler = () => {
      map.getCanvas().style.cursor = '';
    }
    const mapClickedHandler = () => {
      setClickedRide(null);
      setMapWasClicked(true);
    }     

    useEffect(() => {
      if (!map || initializedRef.current) return;
      initializedRef.current = true;
      initializeLayer();

      return () => {
        if (map && map.isStyleLoaded()) {
          map.of("click", mapClickedHandler);
          map.off("click", "rides-lyr", layerClickedHandler);
          map.off("mouseover", "rides-lyr", mouseOverHandler);
          map.off("mousemove", "rides-lyr", mouseMoveHandler);
          map.off("mouseout", "rides-lyr", mouseOutHandler);
        }
      }

    }, [map])

    const initializeLayer = () => {  

      map.addSource("rides-src", {
        "type": "geojson",
        "data": ridesGeojson,
        "cluster": true,
        "clusterMaxZoom": 14,
        "clusterRadius": 50
      });

      map.addLayer({
        "id": "rides-lyr",
        "type": "symbol",
        "source": "rides-src",
        //"filter": ['!', ['has', 'point_count']],
        "layout": {
          "text-field": priceTextFieldExpression,
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 0],
          "text-anchor": "center",
          "icon-image": ["case", 
            ["==", ["get", "isBlackSaddle"], true], "black-pillbox", 
            ["==", ["get", "isBlackSaddle"], false],"white-pillbox",
            ""
          ],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "center",          
        },
        "paint": {
          "text-color": ["case", 
            ["==", ["get", "isBlackSaddle"], true], "#FFF", 
            ["==", ["get", "isBlackSaddle"], false],"#000",
            "#000"
          ]
        }        
      });
      
      map.on("click", mapClickedHandler);
      map.on("click", "rides-lyr", layerClickedHandler);
      map.on("mouseover", "rides-lyr", mouseOverHandler);
      map.on("mousemove", "rides-lyr", mouseMoveHandler);
      map.on("mouseout", "rides-lyr", mouseOutHandler);      
    }

    return (null)
}
export default RidesLayer;