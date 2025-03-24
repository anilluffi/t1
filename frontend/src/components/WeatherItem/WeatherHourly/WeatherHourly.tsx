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
type WeatherHourlyProps = {
  coords: { lat: number; lng: number };
};
export const WeatherHourly: React.FC<WeatherHourlyProps> = ({ coords }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await axiosInstance.get<WeatherData>(
          `weather/Hourly?lat=${latitude}&lon=${longitude}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Ошибка запроса:", error);
        setError("Не удалось получить погоду");
      }
    };

    fetchWeather(coords.lat, coords.lng);
  }, [coords]);
  const hourlyParams = [
    { label: "Air temperature, °C", key: "temp", unit: "°C" },
    { label: "Wind speed, m/s", key: "wind", unit: " m/s" },
    { label: "Wind direction", key: "windDirection", unit: "" },
    { label: "Precipitation", key: "precipitation", unit: "" },
  ];
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

          <div className="conteiner-w-hour"></div>
        </>
      ) : (
        <p>{error ? error : "Loading weather data..."}</p>
      )}
    </div>
  );
};
