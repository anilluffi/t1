import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
interface ApiResponse {
  city: string;
  tempNow: string;
}
interface InfoBoxProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coords: { lat: number; lng: number };
}

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
        console.error("Ошибка запроса:", error);
        setWeather(null);
        setError("Не удалось получить погоду");
      }
    };

    fetchWeather(coords.lat, coords.lng);
  }, [coords]);
  return (
    <div
      className="info-box w-100 rounded-3 text-white"
      style={{
        width: "1000px",
        height: "130px",
        backgroundImage:
          "url(https://static.meteofor.st/ui-mf/assets/bg-desktop-wide/d_c2.webp)",
        backgroundPositionX: "10%",
        backgroundSize: "cover",
      }}
    >
      {weather ? (
        <>
          <p className="m-3 fs-4  ">
            In {weather.city} {weather.tempNow}
          </p>
        </>
      ) : (
        !error && <p>Загружаем данные о погоде...</p>
      )}

      <div className="tabs" style={{ marginTop: "70px" }}>
        {["now", "hourly", "days"].map((tab) => (
          <span
            key={tab}
            className={`tab-link ${activeTab === tab ? "active" : ""}`}
            style={{
              cursor: "pointer",
              color: activeTab === tab ? "orange" : "white",
              margin: "0 10px",
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "now" ? "Now" : tab === "hourly" ? "Hourly" : "7 days"}
          </span>
        ))}
      </div>
    </div>
  );
};
