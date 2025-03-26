import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import "./style.css";
import { ApiResponse, WeatherSevenDaysProps } from "./type";

export const SevenDays: React.FC<WeatherSevenDaysProps> = ({ coords }) => {
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

    fetchWeather(coords.lat, coords.lng);
  }, [coords]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };
  const weatherParams = [
    { label: "Air temperature, °C", key: "temp" },
    { label: "Wind speed, m/s", key: "wind" },
    { label: "Humidity", key: "humidity" },
    { label: "Precipitation", key: "pressure" },
  ];
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
                        <h5>{formatDate(day.date)}</h5>
                      </div>
                    ))}
                  </div>

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

                  {weatherParams.map((param, paramIndex) => (
                    <div key={paramIndex}>
                      <p>{param.label}</p>
                      <div className="weather-day-row">
                        {weather.weekForecast?.map((day, index) => (
                          <div key={index} className="weather-day-column">
                            <p>{day[param.key as keyof typeof day]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
