import React from "react";

const TopButtons = ({setQuery}) => {
  const cities = [
    {
      key: 1,
      name: "Delhi",
    },
    {
      key: 2,
      name: "New York",
    },
    {
      key: 3,
      name: "Sydney",
    },
    {
      key: 4,
      name: "Paris",
    },
  ];
  return (
    <div className="flex items-center justify-center my-6">
      {cities.map((city) => (
        <button
          key={city.key}
          className="flex items-center justify-between text-lg font-medium 
                px-3 py-2 rounded-md transition ease-in hover:bg-gray-700/20"
          onClick={()=>setQuery({q:city.name})}
        >
          {city.name}
        </button>
      ))}
    </div>
  );
};

export default TopButtons;
