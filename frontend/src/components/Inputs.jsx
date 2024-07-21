import React, { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import { FaCity } from "react-icons/fa";
const Inputs = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState();
  const handleClick = (e) => {
    e.preventDefault();
    if (city != "") {
      setQuery({ q: city });
    }
  };
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
      });
    }
  };
  return (
    <form onSubmit={handleClick} className="flex flex-row items-center justify-center space-x-4">
      <input
     
        value={city}
        type="text"
        placeholder="Search By City Name"
        className="text-gray-400 text-xl font-light p-2 
    w-min shadow-xl capitalize focus:outline-none placeholder:lowercase"
        onChange={(e) => setCity(e.currentTarget.value)}
      />
      <BiSearch
        size={30}
        className="cursor-pointer transition ease-out hover:scale-125"
        onClick={handleClick}
      />
      <BiCurrentLocation
        size={30}
        className="cursor-pointer transition ease-out hover:scale-125"
        onClick={handleLocationClick}
      />

      <div
        className="flex flex-row
    items-center justify-center "
      >
        <button
          onClick={()=>setUnits("metric")}
          className="text-2xl font-medium transition ease-out hover:scale-125"
        >
          ºC
        </button>
        <p className="text-2xl font-medium mx-1">|</p>
        <button
          onClick={()=>setUnits("imperial")}
          className="text-2xl font-medium transition ease-out hover:scale-125"
        >
          ºF
        </button>
      </div>
    </form>
  );
};

export default Inputs;
