import express from "express";
import dotenv from "dotenv";
import { DateTime } from "luxon";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.post("/api", async (req, res) => {
  try {
    const { q, units, lat, lon } = req.body;
    var weatherData;
    if (q) weatherData = await getFormattedData({q,units});
    else {
      weatherData = await getFormattedData({ lat, lon,units });
    }
    return res.status(400).json(weatherData);
  } catch (error) {
    console.log("error in getting weather data", error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
};
const getIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;
const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => {
  return DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);
};

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, temp_min, temp_max, humidity, feels_like },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;
  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    speed,
    humidity,
    country,
    formattedLocalTime,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    details,
    icon: getIconUrl(icon),
    dt,
    timezone,
    lat,
    lon,
    name,
  };
};

const formatForecastWeather = (secs, offset, data) => {
  const hourly = data
    .filter((f) => f.dt > secs)
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "hh:mm a"),
      icon: getIconUrl(f.weather[0].icon),
      date: f.dt_txt,
    }))
    .slice(0, 5);
  const daily = data
    .filter((f) => f.dt_txt.slice(-8) === "00:00:00")
    .map((f) => ({
      temp: f.main.temp,
      title: formatToLocalTime(f.dt, offset, "ccc"),
      icon: getIconUrl(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

const getFormattedData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then((data) => formatCurrent(data));
  // console.log(formattedCurrentWeather);
  const { dt, lat, lon, timezone } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  }).then((d) => formatForecastWeather(dt, timezone, d.list));

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};
