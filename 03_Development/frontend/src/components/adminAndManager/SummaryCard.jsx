import React from "react";

const SummaryCard = ({ icon, text, number, color, handleClick }) => {
  return (
    <div onClick={handleClick} className="rounded-lg flex bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div
        className={`text-3xl flex justify-center items-center text-white px-6 py-4 rounded-l-lg ${color}`}
      >
        {icon}
      </div>
      <div className="pl-4 py-3 flex flex-col justify-center">
        <p className="text-lg font-semibold text-gray-700">{text}</p>
        <p className="text-2xl font-bold text-gray-900">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
