import React, { useState, useEffect } from "react";
import citiesData from "../../../ua-cities.json";
import "./style.css";

type City = {
  name: string;
  lat: number;
  lng: number;
};

type HeaderTopProps = {
  onCitySelect: (lat: number, lng: number, cityName: string) => void;
  cityTab: string;
  setCityTab: (tab: string) => void;
};

const HeaderTop: React.FC<HeaderTopProps> = ({
  onCitySelect,
  cityTab,
  setCityTab,
}) => {
  const [cityInput, setCityInput] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [geoCity, setGeoCity] = useState<string>("Definition...");
  const [geoCoords, setGeoCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const countryData = citiesData[0];
  const tabs = ["city1", "c2", "c3"];
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const foundCity = findCityByCoords(latitude, longitude);

        setGeoCoords({ lat: latitude, lng: longitude });

        if (foundCity) {
          setGeoCity(foundCity.name);
          onCitySelect(latitude, longitude, foundCity.name);
        } else {
          setGeoCity("Неизвестный город");
        }
      },
      () => setGeoCity("Геопозиция недоступна")
    );

    if (cityInput.trim() === "") {
      setFilteredCities([]);
      return;
    }

    const lowerInput = cityInput.toLowerCase();
    const matchedCities: City[] = [];

    for (const region of countryData.regions) {
      const matches = region.cities.filter((city) =>
        city.name.toLowerCase().includes(lowerInput)
      );

      matchedCities.push(
        ...matches.map((city) => ({
          name: city.name,
          lat: Number(city.lat),
          lng: Number(city.lng),
        }))
      );
    }

    setFilteredCities(matchedCities.slice(0, 10));

    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      const parsedCity = JSON.parse(savedCity);
      setCityName(parsedCity.name);
      onCitySelect(parsedCity.lat, parsedCity.lng, parsedCity.name);
      setCityTab("c3");
    }
  }, [cityInput]);

  const handleCitySelect = (city: City) => {
    setCityInput(city.name);
    onCitySelect(city.lat, city.lng, city.name);
    localStorage.setItem("lastCity", JSON.stringify(city));
    setCityName(city.name);
    setCityTab("c3");
    setIsSearchOpen(false);
  };

  const findCityByCoords = (lat: number, lng: number): City | undefined => {
    for (const region of countryData.regions) {
      const foundCity = region.cities.find((city) => {
        const cityLat = Number(city.lat);
        const cityLng = Number(city.lng);
        return Math.abs(cityLat - lat) < 0.1 && Math.abs(cityLng - lng) < 0.1;
      });

      if (foundCity) {
        return {
          name: foundCity.name,
          lat: Number(foundCity.lat),
          lng: Number(foundCity.lng),
        };
      }
    }
    return undefined;
  };

  const handleSearch = () => {
    let foundCity: City | undefined;

    for (const region of countryData.regions || []) {
      if (Array.isArray(region.cities)) {
        const city = region.cities.find(
          (city) =>
            city.name && city.name.toLowerCase() === cityInput.toLowerCase()
        );

        if (city) {
          foundCity = {
            name: city.name,
            lat: Number(city.lat),
            lng: Number(city.lng),
          };
          break;
        }
      }
    }

    if (foundCity) {
      onCitySelect(foundCity.lat, foundCity.lng, foundCity.name);
      localStorage.setItem("lastCity", JSON.stringify(foundCity));
      setCityName(foundCity.name);
      setCityTab("c3");
    } else {
      alert("Город не найден");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTabChange = (tab: string) => {
    setCityTab(tab);

    if (tab === "city1" && geoCoords) {
      onCitySelect(geoCoords.lat, geoCoords.lng, geoCity);
    } else if (tab === "c2") {
      onCitySelect(50.45, 30.52, "Kyiv");
    } else if (tab === "c3" && cityName) {
      const savedCity = localStorage.getItem("lastCity");
      if (savedCity) {
        const parsedCity = JSON.parse(savedCity);
        onCitySelect(parsedCity.lat, parsedCity.lng, parsedCity.name);
      }
    }
  };

  return (
    <div className="header-top">
      <div className="left-top">
        <h4 className="Logo">Meteofor</h4>

        <div className="input-group ">
          <span onClick={handleSearch} className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            onClick={toggleSearch}
            className="form-control"
            placeholder="search city"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {isSearchOpen && filteredCities.length > 0 && (
            <div
              className={`search-div ${
                isSearchOpen ? "search-div-active" : ""
              }`}
            >
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  className="search-item"
                  onClick={() => handleCitySelect(city)}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="city-tabs">
          {tabs.map((tab) => (
            <span
              key={tab}
              className={`tab-link ${cityTab === tab ? "active" : ""}`}
              style={{ color: cityTab === tab ? "orange" : "black" }}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "city1"
                ? geoCity
                : tab === "c2"
                ? "Kyiv"
                : cityName || ""}
            </span>
          ))}
        </div>
      </div>

      <select className="custom-select">
        <optgroup label="Temperature">
          <option value="celsius" selected>
            °C
          </option>
          <option value="fahrenheit">°F</option>
        </optgroup>
        <optgroup label="Wind Speed">
          <option value="m/s" selected>
            m/s
          </option>
          <option value="km/h">km/h</option>
          <option value="miles/h">miles/h</option>
        </optgroup>
        <optgroup label="Pressure">
          <option value="mmhg" selected>
            mmHg
          </option>
          <option value="hpa">hPa</option>
        </optgroup>
        <optgroup label="Language">
          <option value="en" selected>
            En
          </option>
          <option value="ru">Ru</option>
        </optgroup>
        <optgroup label="Theme">
          <option value="light">Light theme</option>
          <option value="dark">Dark theme</option>
          <option value="system">System theme</option>
        </optgroup>
      </select>
    </div>
  );
};

export default HeaderTop;
