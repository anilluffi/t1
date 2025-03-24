import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import citiesData from "../../../ua-cities.json";
import "./style.css";

interface ApiResponse {
  city: string;
  weatherNow: string;
  tempNow: string;
  windNow: string;
  pressureNow: string;
  humidityNow: string;
  description: string;
  icon: string;
}
type WeatherNowProps = {
  coords: { lat: number; lng: number };
};
export const WeatherNow: React.FC<WeatherNowProps> = ({ coords }) => {
  const [weather, setWeather] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["Now", "Today", "Tomorrow"];
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [activeTab, setActiveTab] = useState("Now");
  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        console.log(latitude, " ", longitude);
        const response = await axiosInstance.get<ApiResponse>(
          `weather/now?lat=${latitude}&lon=${longitude}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Ошибка запроса:", error);
        setWeather(null);
        setError("Не удалось получить погоду");
      }
    };

    fetchWeather(coords.lat, coords.lng);
  }, [coords]);

  return (
    <div>
      {weather ? (
        <>
          <h4>Wather in {weather.city} now</h4>

          <div className="weathertabs">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`weathertab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="mini-tab">
                  <div>
                    <h6>{tab}</h6>
                    {tab === "Now" && <p className="text-time">{time}</p>}
                    {tab !== "Now" && <p className="text-time"> _</p>}
                    <h5>{weather.tempNow}</h5>
                  </div>

                  <img src={weather.icon} alt="Weather icon" className="icon" />
                </div>
              </div>
            ))}
          </div>
          <div className="conteiner-w-now h-100">
            <div className="detail-conteiner">
              <h1 className="display-1 text-center text-white">
                {weather.tempNow}
              </h1>

              <div className="details-w-now d-flex justify-content-around align-items-center  text-white px-3">
                <div>
                  <h3>wind</h3> <h2>{weather.windNow}</h2>
                </div>
                <div>
                  <h3>pressure</h3> <h2>{weather.pressureNow}</h2>
                </div>
                <div>
                  <h3>humidity</h3> <h2>{weather.humidityNow}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center conteiner-w-now  h-100">
            <h4>Nearest weather stations</h4>
            <hr className="divider" />
          </div>
          <div className="text-center conteiner-w-now  h-100"></div>
        </>
      ) : (
        !error && <p>Loading weather data...</p>
      )}
    </div>
  );
};
