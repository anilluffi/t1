import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import "./style.css";
import { ApiResponse, WeatherNowProps } from "./type";
import { TabNow } from "./components/TabNow/TabNow";
import { TabToday } from "./components/TabToday/TabToday";
import { TabTomorrow } from "./components/TabTomorrow/TabTomorrow";
import { NowDetailConteiner } from "./components/NowDetailConteiner/NowDetailConteiner";
import { DayDetailContainer } from "./components/DayDetailConteiner/DayDetailConteiner";

const getFormattedDate = (daysOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
};

export const WeatherNow: React.FC<WeatherNowProps> = ({ coords }) => {
  const [weather, setWeather] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["Now", "Today", "Tomorrow"];
  const [activeTab, setActiveTab] = useState("Now");

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
    <div>
      {weather ? (
        <>
          <h4>Weather in {weather.city} now</h4>

          <div className="weathertabs">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`weathertab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Now" && (
                  <TabNow temp={weather.tempNow} iconUrl={weather.icon} />
                )}
                {tab === "Today" && (
                  <TabToday
                    tempMin={"+14"}
                    tempMax={"+20"}
                    iconUrl={weather.icon}
                  />
                )}
                {tab === "Tomorrow" && (
                  <TabTomorrow
                    tempMin={"+14"}
                    tempMax={"+20"}
                    iconUrl={weather.icon}
                  />
                )}
              </div>
            ))}
          </div>

          {activeTab === "Now" && (
            <NowDetailConteiner
              temp={weather.tempNow}
              wind={weather.windNow}
              pressure={weather.pressureNow}
              humidity={weather.humidityNow}
            />
          )}

          {activeTab === "Today" && (
            <DayDetailContainer
              coord={{
                lat: coords.lat,
                lng: coords.lng,
              }}
              date={getFormattedDate(0)}
            />
          )}

          {activeTab === "Tomorrow" && (
            <DayDetailContainer
              coord={{
                lat: coords.lat,
                lng: coords.lng,
              }}
              date={getFormattedDate(1)}
            />
          )}
        </>
      ) : (
        !error && <p>Loading weather data...</p>
      )}
    </div>
  );
};
