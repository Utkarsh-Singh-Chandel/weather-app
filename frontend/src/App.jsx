import React, { useEffect, useState } from "react";
import TopButtons from "./components/TopButtons/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const [query, setQuery] = useState({ q: "Delhi" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState();
  const msg=query.q?query.q:"Current Location"
 
  const getWeather =async  () => {
    const url="https://weather-app-backend-6yyb.onrender.com/api/api"
    toast.info(`Fetching Data for ${msg}`);
    await fetch(url,{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({...query,units})
    }).then((res)=>{
    return res.json();
  })
    .then((data)=>{
      toast.success(`Fetched weather data for ${msg} successfully`)
      setWeather(data);
    })
    }
  
  useEffect(()=>{
    getWeather();
  }, [query, units]);
  const formatBackground=()=>{
    if(!weather)
    return 'from-cyan-600 to-blue-700'
    const threshold=units==='metric'?20:60
    if(weather.temp<=threshold)
    return 'from-cyan-600 to-blue-700'
    return 'from-yellow-600 to-orange-700'

  }
  return (
    <div className="flex items-center justify-center mx-auto  max-w-screen-lg w-auto">
    <div className={`mx-auto max-w-screen-lg py-5 px-32 bg-gradient-to-br shadow-xl
     shadow-gray-400 ${formatBackground()} scale-90`}>
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} setUnits={setUnits} />
      {weather && (
        <>
          <TimeAndLocation units={units} weather={weather} />
         
          <TempAndDetails weather={weather} units={units}/>
          <Forecast title='3 Hour Forecast' data={weather.hourly} units={units} />
          <Forecast title='Daily Forecast' data={weather.daily} />
        </>
      )}
      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
    </div>
  );
};

export default App;
