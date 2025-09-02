"use-client"

// Core
import { useEffect, useRef } from "react";

const ClusterLayer = ({map}) => {
    
    const initializedRef = useRef(false);

    useEffect(() => {
      if (!map || initializedRef.current) return;
      initializedRef.current = true;
      initializeLayer();

      return () => {
        if (map && map.isStyleLoaded()) {
          map.off("click", "clusters", clusterClickedHandler);
        }
      }

    }, [map])

    // Handlers
    const clusterClickedHandler = (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource('rides-src')
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            "center": features[0].geometry.coordinates,
            "zoom": zoom
          });
        });
    }

    const initializeLayer = () => {         
      map.addLayer({
        "id": "clusters",
        "type": "circle",
        "source": "rides-src",
        "filter": ["has", "point_count"],
        "paint": {
          "circle-color": [
            "step",
            ["get", "point_count"],
            '#B0892D',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ],
          "circle-emissive-strength": 1
        }
      });
          
      map.addLayer({
        "id": "cluster-count",
        "type": "symbol",
        "source": "rides-src",
        "filter": ["has", "point_count"],
        "layout": {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        },
        "paint": {
          "text-color": "#FFF"
        }
      }); 
      
      map.on("click", "clusters", clusterClickedHandler);      
    }

    return (null)
}
export default ClusterLayer;