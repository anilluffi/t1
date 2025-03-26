import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import { InfoBoxProps, ApiResponse } from "./type";
import "./style.css";

export const InfoBox: React.FC<InfoBoxProps> = ({
  activeTab,
  setActiveTab,
  coords,
}) => {
  const [weather, setWeather] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await axiosInstance.get<ApiResponse>(
          `weather/now?lat=${latitude}&lon=${longitude}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Request error:", error);
        setWeather(null);
        setError("Failed to get weather data");
      }
    };

    fetchWeather(coords.lat, coords.lng);
  }, [coords]);

  return (
    <div className="info-box w-100 rounded-3 text-white">
      {weather ? (
        <>
          <p className="m-3 fs-4">
            In {weather.city} {weather.tempNow}
          </p>
        </>
      ) : (
        !error && <p>Loading weather data...</p>
      )}

      <div className="tabs">
        {["now", "hourly", "days"].map((tab) => (
          <span
            key={tab}
            className={`tab-link ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "now" ? "Now" : tab === "hourly" ? "Hourly" : "7 days"}
          </span>
        ))}
      </div>
    </div>
  );
};
