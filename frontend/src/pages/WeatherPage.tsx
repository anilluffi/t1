import React, { useState, useEffect } from "react";
import { WeatherHourly } from "../components/WeatherItem/WeatherHourly/WeatherHourly";
import { SevenDays } from "../components/WeatherItem/SevenDays/SevenDays";
import { FavoriteCity } from "../components/WeatherItem/FavoriteCity/FavoriteCity";
import HeaderTop from "../components/WeatherItem/HeaderTop/HeaderTop";
import { WeatherNow } from "../components/WeatherItem/WeatherNow/WeatherNow";
import { InfoBox } from "../components/WeatherItem/InfoBox/InfoBox";

const WeatherPage = () => {
  const [activeTab, setActiveTab] = useState("now");
  const [cityTab, setCityTab] = useState("city1");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const handleCitySelect = (lat: number, lng: number, cityName: string) => {
    setCoordinates({ lat, lng });
    localStorage.setItem(
      "lastCoordinates",
      JSON.stringify({ lat, lng, cityName })
    );
  };

  useEffect(() => {
    const savedCoords = localStorage.getItem("lastCoordinates");
    if (savedCoords) {
      const parsedCoords = JSON.parse(savedCoords);
      setCoordinates({ lat: parsedCoords.lat, lng: parsedCoords.lng });
    }
  }, []);

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: "1000px" }}>
        <HeaderTop
          onCitySelect={handleCitySelect}
          cityTab={cityTab}
          setCityTab={setCityTab}
        />
        <InfoBox
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          coords={coordinates}
        />

        <div className="Main-w">
          <div className="tab-content">
            {activeTab === "now" && <WeatherNow coords={coordinates} />}
            {activeTab === "hourly" && <WeatherHourly coords={coordinates} />}
            {activeTab === "days" && <SevenDays coords={coordinates} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
