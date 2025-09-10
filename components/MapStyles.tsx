"use client"

import React from 'react'

export function MapStyles() {
  return (
    <style jsx global>{`
      /* Enhanced State Boundary Styling */
      .state-boundary-polygon {
        transition: all 0.3s ease-in-out !important;
        cursor: pointer !important;
      }
      
      .state-boundary-polygon:hover {
        filter: brightness(1.1) !important;
        transform: translateZ(10px) !important;
      }

      /* Enhanced State Polygon Styling for StateLayer */
      .state-polygon {
        transition: all 0.2s ease-in-out !important;
        cursor: pointer !important;
      }
      
      .state-polygon:hover {
        filter: brightness(1.1) !important;
      }
      
      .state-hovered {
        filter: brightness(1.15) drop-shadow(0 4px 8px rgba(0,0,0,0.3)) !important;
      }

      /* Enhanced Custom Tooltip Styling */
      .custom-tooltip {
        background: rgba(0, 0, 0, 0.85) !important;
        border: none !important;
        border-radius: 8px !important;
        color: white !important;
        font-size: 12px !important;
        padding: 8px 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        backdrop-filter: blur(4px) !important;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        line-height: 1.4 !important;
      }
      
      .custom-tooltip:before {
        border-top-color: rgba(0, 0, 0, 0.85) !important;
      }

      /* State Label Container Enhanced Styling */
      .state-label-container {
        transition: all 0.2s ease-in-out !important;
        pointer-events: none !important;
      }
      .state-label-icon {
        background: transparent !important;
        border: none !important;
        pointer-events: none !important;
        z-index: 1000 !important;
      }
      
      .state-label-marker {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(8px) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        padding: 6px 10px !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
        text-align: center !important;
        white-space: nowrap !important;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
        transform: translate(-50%, -50%) !important;
        transition: all 0.2s ease-in-out !important;
      }
      
      .state-label-marker:hover {
        transform: translate(-50%, -50%) scale(1.05) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
      }

      /* Enhanced Popup Styling */
      .state-info-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        border: 1px solid rgba(229, 231, 235, 0.8) !important;
      }
      
      .state-info-popup .leaflet-popup-content {
        margin: 16px !important;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
      }
      
      .state-info-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.98) !important;
        border: 1px solid rgba(229, 231, 235, 0.8) !important;
        backdrop-filter: blur(10px) !important;
      }

      /* Custom Marker Styling */
      .custom-div-icon {
        background: transparent !important;
        border: none !important;
      }
      
      .custom-div-icon div {
        transition: all 0.2s ease-in-out !important;
      }
      
      .custom-div-icon:hover div {
        transform: scale(1.2) !important;
        filter: brightness(1.1) !important;
      }

      /* Map Controls Enhancement */
      .leaflet-control-zoom {
        border: none !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      
      .leaflet-control-zoom a {
        background: transparent !important;
        border: none !important;
        color: #374151 !important;
        font-weight: 600 !important;
        transition: all 0.2s ease-in-out !important;
      }
      
      .leaflet-control-zoom a:hover {
        background: rgba(59, 130, 246, 0.1) !important;
        color: #3b82f6 !important;
      }

      /* Attribution Styling */
      .leaflet-control-attribution {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(5px) !important;
        border-radius: 6px !important;
        border: 1px solid rgba(229, 231, 235, 0.6) !important;
        font-size: 10px !important;
      }

      /* Cluster Styling */
      .marker-cluster {
        background: rgba(59, 130, 246, 0.9) !important;
        border: 2px solid rgba(255, 255, 255, 0.9) !important;
        border-radius: 50% !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        transition: all 0.2s ease-in-out !important;
      }
      
      .marker-cluster:hover {
        background: rgba(59, 130, 246, 1) !important;
        transform: scale(1.1) !important;
      }
      
      .marker-cluster div {
        background: transparent !important;
        color: white !important;
        font-weight: bold !important;
        font-size: 12px !important;
      }

      /* Map Container Enhancements */
      .leaflet-container {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
      }

      /* Loading Animation */
      .map-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      /* Responsive Adjustments */
      @media (max-width: 768px) {
        .state-label-marker {
          font-size: 10px !important;
          padding: 4px 6px !important;
        }
        
        .state-info-popup .leaflet-popup-content {
          margin: 12px !important;
        }
        
        .state-info-popup .leaflet-popup-content-wrapper {
          max-width: 280px !important;
        }
        
        .leaflet-control-zoom {
          transform: scale(0.9) !important;
        }
      }
      
      @media (max-width: 480px) {
        .state-label-marker {
          font-size: 9px !important;
          padding: 3px 5px !important;
        }
        
        .leaflet-control-zoom {
          transform: scale(0.8) !important;
        }
      }

      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        .state-info-popup .leaflet-popup-content-wrapper {
          background: rgba(31, 41, 55, 0.98) !important;
          color: #f9fafb !important;
        }
        
        .state-info-popup .leaflet-popup-tip {
          background: rgba(31, 41, 55, 0.98) !important;
        }
        
        .leaflet-control-zoom {
          background: rgba(31, 41, 55, 0.95) !important;
        }
        
        .leaflet-control-zoom a {
          color: #f9fafb !important;
        }
      }
    `}</style>
  )
}