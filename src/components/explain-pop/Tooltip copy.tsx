import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Tooltip.css';

interface TooltipProps {
  message: string;
  icon: React.ReactNode|any;
}

const Tooltip: React.FC<TooltipProps> = ({ message, icon }) => {
    debugger
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleIconClick = (e:any) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  return (
    <div className="tooltip-container">
      <div className="tooltip-icon" ref={iconRef} onClick={(e)=>{handleIconClick(e)}}>
        <img src={icon} alt="info icon" />
      </div>
      {isVisible && (
        <div
          className="tooltip-popup"
          ref={tooltipRef}
          style={{
            top: iconRef.current?.getBoundingClientRect().bottom ?? 0,
            left: iconRef.current?.getBoundingClientRect().left ?? 0,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
