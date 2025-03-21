import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";
import citiesData from "../ua-cities.json";
import { WeatherHourly } from "../components/WeatherItem/WeatherHourly/WeatherHourly";
import { SevenDays } from "../components/WeatherItem/SevenDays/SevenDays";
import { FavoriteCity } from "../components/WeatherItem/FavoriteCity/FavoriteCity";
import { HeaderTop } from "../components/WeatherItem/HeaderTop/HeaderTop";
import { WeatherNow } from "../components/WeatherItem/WeatherNow/WeatherNow";
import { InfoBox } from "../components/WeatherItem/InfoBox/InfoBox";
interface ApiResponse {
  city: string;
  weatherNow: string;
  weatherAfter3h: string;
  weatherAfter6h: string;
  weekForecast?: {
    date: string;
    temp: string;
    description: string;
  }[];
}

const WeatherPage = () => {
  const [activeTab, setActiveTab] = useState("now");

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "1000px" }}>
        <div className="Head" style={{ marginTop: "10px" }}>
          <HeaderTop />
          <InfoBox activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="Main-w">
          <div className="tab-content">
            {activeTab === "now" && <WeatherNow />}
            {activeTab === "hourly" && <WeatherHourly />}
            {activeTab === "days" && <SevenDays />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
