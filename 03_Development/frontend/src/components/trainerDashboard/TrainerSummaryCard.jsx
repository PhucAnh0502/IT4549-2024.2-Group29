import React from "react";

const TrainerSummaryCard = ({ icon, text, number, color, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg flex bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
      title={`Xem chi tiết ${text.toLowerCase()}`}
    >
      <div
        className={`text-2xl sm:text-3xl flex justify-center items-center text-white px-5 py-4 rounded-l-lg ${color}`}
      >
        {icon}
      </div>
      <div className="pl-4 py-3 flex flex-col justify-center">
        <p className="text-base sm:text-lg font-semibold text-gray-700">
          {text}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">
          {number}
        </p>
      </div>
    </div>
  );
};

export default TrainerSummaryCard;
