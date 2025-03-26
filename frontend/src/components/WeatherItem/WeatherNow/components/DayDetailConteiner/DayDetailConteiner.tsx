import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../../axiosInstance";
import { AxiosError } from "axios";
import "./style.css";
import { DayDetailContainerProps, WeatherData } from "./type";

export const DayDetailContainer: React.FC<DayDetailContainerProps> = ({
  coord,
  date,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (
      latitude: number,
      longitude: number,
      date: string
    ) => {
      try {
        const response = await axiosInstance.get<WeatherData>(
          `weather/DayHourly?lat=${latitude}&lon=${longitude}&date=${date}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Request Error:", error);
        setError("Failed to get weather");
      }
    };

    fetchWeather(coord.lat, coord.lng, date);
  }, [coord, date]);

  const hourlyParams = [
    { label: "Air temperature", key: "temp", unit: "°C" },
    { label: "Wind speed", key: "wind", unit: " m/s" },
    { label: "Wind direction", key: "windDirection", unit: "" },
    { label: "Precipitation", key: "precipitation", unit: " mm" },
  ];

  return (
    <div>
      {weather ? (
        <>
          {/* <h4>
            Weather in {weather.city} on {date}
          </h4> */}
          <div className="container-today">
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

              {hourlyParams.map((param, paramIndex) => (
                <div key={paramIndex}>
                  <p>{param.label}</p>
                  <div className="weather-row">
                    {weather.hourly.map((hour, index) => (
                      <div key={index} className="weather-col">
                        {hour[param.key as keyof typeof hour]}
                        {param.unit}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p>{error ? error : "Loading weather data..."}</p>
      )}
    </div>
  );
};
