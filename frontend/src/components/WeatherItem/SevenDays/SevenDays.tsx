import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import citiesData from "../../../ua-cities.json";
import "./style.css";

interface ApiResponse {
  city: string;
  weekForecast?: {
    date: string;
    temp: string;
    wind: string;
    description: string;
    humidity: string;
    pressure: string;
    icon: string;
  }[];
}

export const SevenDays = () => {
  const [weather, setWeather] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await axiosInstance.get<ApiResponse>(
          `weather/week?lat=${latitude}&lon=${longitude}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Ошибка запроса:", error);
        setWeather(null);
        setError("Failed to fetch weather data");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Failed to get location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          {weather ? (
            <>
              <h4>Weather in {weather.city} for 7 days</h4>
              <div className="conteiner-w-day">
                <div className="weather">
                  <div className="weather-day-row">
                    {weather.weekForecast?.map((day, index) => (
                      <div key={index} className="weather-day-column">
                        <h5>{day.date}</h5>
                      </div>
                    ))}
                  </div>{" "}
                  <div className="weather-day-row">
                    {weather.weekForecast?.map((day, index) => (
                      <div key={index} className="weather-day-column">
                        <img
                          src={day.icon}
                          alt="Weather icon"
                          className="icon"
                        />
                      </div>
                    ))}
                  </div>
                  <p>Air temperature, °C</p>
                  <div className="weather-day-row">
                    {weather.weekForecast?.map((day, index) => (
                      <div key={index} className="weather-day-column">
                        <p>{day.temp}</p>
                      </div>
                    ))}
                  </div>
                  <p>Wind speed, m/s</p>
                  <div className="weather-day-row">
                    {weather.weekForecast?.map((day, index) => (
                      <div key={index} className="weather-day-column">
                        <p>{day.wind}</p>
                      </div>
                    ))}
                  </div>
                  <p>Humidity</p>
                  <div className="weather-day-row">
                    {weather.weekForecast?.map((day, index) => (
                      <div key={index} className="weather-day-column">
                        <p>{day.humidity}</p>
                      </div>
                    ))}
                  </div>
                  <p>Precipitation</p>
                  <div className="weather-day-row">
                    {weather.weekForecast?.map((day, index) => (
                      <div key={index} className="weather-day-column">
                        <p>{day.pressure}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            !error && <p>Loading weather data...</p>
          )}
        </>
      ) : (
        <>
          <p>
            You need to{" "}
            <a className="text-warning" href="/register">
              register
            </a>
            /
            <a className="text-info" href="/login">
              login
            </a>
          </p>
        </>
      )}
    </div>
  );
};
