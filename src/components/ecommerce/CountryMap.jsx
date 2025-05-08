// react plugin for creating vector maps
import React, { useEffect, useRef } from "react";
// Import jQuery for direct jVectorMap usage
import $ from "jquery";
// Import the world map data
import { worldMill } from "@react-jvectormap/world";

// Import jVectorMap CSS if needed (you may already have this in your project)
// import "@react-jvectormap/core/dist/css/jquery-jvectormap.css";

// We'll use direct JVectorMap initialization since the React wrapper is causing issues
const CountryMap = ({ mapColor }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Make sure jQuery and jVectorMap are available
    if (!$ || !$.fn.vectorMap) {
      console.error("jQuery or jVectorMap is not available");
      return;
    }

    // Only initialize if not already initialized
    if (mapRef.current && !mapInstanceRef.current) {
      try {
        // Initialize jVectorMap directly
        $(mapRef.current).vectorMap({
          map: worldMill,
          backgroundColor: "transparent",
          markerStyle: {
            initial: {
              fill: "#465FFF",
              r: 4,
            },
          },
          markers: [
            {
              latLng: [37.2580397, -104.657039],
              name: "United States",
              style: {
                fill: "#465FFF",
                borderWidth: 1,
                borderColor: "white",
                stroke: "#383f47",
              },
            },
            {
              latLng: [20.7504374, 73.7276105],
              name: "India",
              style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
            },
            {
              latLng: [53.613, -11.6368],
              name: "United Kingdom",
              style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
            },
            {
              latLng: [-25.0304388, 115.2092761],
              name: "Australia",
              style: {
                fill: "#465FFF",
                borderWidth: 1,
                borderColor: "white",
                strokeOpacity: 0,
              },
            },
          ],
          zoomOnScroll: false,
          zoomMax: 12,
          zoomMin: 1,
          zoomAnimate: true,
          zoomStep: 1.5,
          regionsSelectable: true,
          markersSelectable: true,
          regionStyle: {
            initial: {
              fill: mapColor || "#D0D5DD",
              fillOpacity: 1,
              fontFamily: "Outfit",
              stroke: "none",
              strokeWidth: 0,
              strokeOpacity: 0,
            },
            hover: {
              fillOpacity: 0.7,
              cursor: "pointer",
              fill: "#465fff",
              stroke: "none",
            },
            selected: {
              fill: "#465FFF",
            },
            selectedHover: {},
          },
          regionLabelStyle: {
            initial: {
              fill: "#35373e",
              fontWeight: 500,
              fontSize: "13px",
              stroke: "none",
            },
          },
        });
        
        // Store the map instance for cleanup
        mapInstanceRef.current = $(mapRef.current).vectorMap('get', 'mapObject');
      } catch (error) {
        console.error("Error initializing jVectorMap:", error);
      }
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        // Properly remove the map instance
        try {
          mapInstanceRef.current = null;
          $(mapRef.current).empty();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, [mapColor]); // Re-initialize if mapColor changes

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full vector-map"
    />
  );
};

export default CountryMap;