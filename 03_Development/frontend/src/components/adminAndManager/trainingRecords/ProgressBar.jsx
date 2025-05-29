import React from "react";

const ProgressBar = ({ progress, width }) => {
  const barWidth = (progress / 100) * width; 

  return (
    <div className={`w-[${width}px]`}>
      <div className="relative bg-gray-300 rounded-full h-6 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300 ease-in-out"
          style={{ width: `${barWidth}px` }}
        ></div>
        <div className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-white">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
