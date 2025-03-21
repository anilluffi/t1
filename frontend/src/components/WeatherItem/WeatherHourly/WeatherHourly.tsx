import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import "./style.css";

interface WeatherData {
  city: string;
  hourly: {
    time: string;
    temp: number;
    wind: number;
    windDirection: string;
    precipitation: number;
    icon: string;
  }[];
}

export const WeatherHourly = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await axiosInstance.get<WeatherData>(
          `auth/weather?lat=${latitude}&lon=${longitude}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Ошибка запроса:", error);
        setError("Не удалось получить погоду");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Не удалось получить геопозицию");
        }
      );
    } else {
      setError("Геолокация не поддерживается вашим браузером");
    }
  }, []);

  return (
    <div>
      {weather ? (
        <>
          <h4>Weather in {weather.city} by hour</h4>
          <div className="conteiner-w-hour">
            <div className="weather-hourly">
              <div className="weather-row">
                {weather.hourly.map((hour, index) => (
                  <div key={index} className="weather-col">
                    {hour.time}
                  </div>
                ))}
              </div>
              <div className="weather-row">
                {weather.hourly.map((hour, index) => (
                  <div key={index} className="weather-col">
                    <img src={hour.icon} alt="Weather icon" className="icon" />
                  </div>
                ))}
              </div>
              <p>Air temperature, °C</p>

              <div className="weather-row">
                {weather.hourly.map((hour, index) => (
                  <div key={index} className="weather-col">
                    {hour.temp}°C
                  </div>
                ))}
              </div>

              <p>Wind speed, m/s</p>
              <div className="weather-row">
                {weather.hourly.map((hour, index) => (
                  <div key={index} className="weather-col">
                    {hour.wind} m/s
                  </div>
                ))}
              </div>

              <p>Wind direction</p>
              <div className="weather-row">
                {weather.hourly.map((hour, index) => (
                  <div key={index} className="weather-col">
                    {hour.windDirection}
                  </div>
                ))}
              </div>

              <p>Precipitation</p>
              <div className="weather-row">
                {weather.hourly.map((hour, index) => (
                  <div key={index} className="weather-col">
                    {hour.precipitation}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="conteiner-w-hour"></div>
        </>
      ) : (
        <p>{error ? error : "Loading weather data..."}</p>
      )}
    </div>
  );
};
