import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Tooltip.css';

interface TooltipProps {
  message: string;
  icon: React.ReactNode|any;
  style?: any;
  popupStyle?: string;
  containerRef?:any
}

const Tooltip: React.FC<TooltipProps> = ({ message, icon, style, popupStyle, containerRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    

    function mouseInside(){
        setIsVisible(true);
        debugger
    }
    function mouseOutside(){
        setIsVisible(false);
    }

  return (
    <div className="tooltip-container" onMouseEnter={mouseInside} onMouseLeave={mouseOutside} id={style}>
      <div className="tooltip-icon" ref={iconRef}>
        <img src={icon} alt="info icon" />
      </div>
      {isVisible && (
        <div
          id={popupStyle}
          className="tooltip-popup"
          ref={tooltipRef}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
