"use client"

import React from 'react'

interface SliderStylesProps {
  layerColor: string
  opacity: number
  className?: string
}

export function SliderStyles({ layerColor, opacity, className = "" }: SliderStylesProps) {
  return (
    <style jsx>{`
      .${className}::-webkit-slider-thumb {
        appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid ${layerColor};
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .${className}::-moz-range-thumb {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid ${layerColor};
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        border: none;
      }
      
      .${className} {
        background: linear-gradient(to right, ${layerColor} 0%, ${layerColor} ${opacity}%, #e5e7eb ${opacity}%, #e5e7eb 100%);
      }
    `}</style>
  )
}