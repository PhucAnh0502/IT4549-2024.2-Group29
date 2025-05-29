import React from "react";
import headerImage from "../../assets/header.jpg";

const Header = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${headerImage})` }}
    >

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

      <div className="relative text-center max-w-2xl px-6">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wide text-red-500">
          Be Strong
        </h2>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-red-500">
          Build Your Dream Body
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          turpis ipsum, congue nec sollicitudin et, mattis ac ex.
        </p>

        <button className="mt-6 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-600 transition duration-300 shadow-lg">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Header;
