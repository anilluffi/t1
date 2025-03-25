import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import "./style.css";

interface ApiResponse {
  city: string;
}
interface SearchResponse {
  city: string[];
}
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
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const tabs = ["city1", "c2", "c3"];

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoCoords({ lat: latitude, lng: longitude });

        fetchCityByGeo(latitude, longitude);
      },
      () => setGeoCity("Geolocation unavailable")
    );

    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      const parsedCity = JSON.parse(savedCity);
      setCityName(parsedCity.name);
      onCitySelect(parsedCity.lat, parsedCity.lng, parsedCity.name);
      setCityTab("c3");
    }
  }, []);

  const fetchCityByGeo = async (lat: number, lon: number) => {
    try {
      const response = await axiosInstance.get<ApiResponse>(
        `weather/now?lat=${lat}&lon=${lon}`
      );
      const data = response.data;

      if (data && data.city) {
        setGeoCity(data.city);
        onCitySelect(lat, lon, data.city);
      } else {
        setGeoCity("Unknown city");
      }
    } catch (error) {
      console.error("Error fetching city by geolocation:", error);
      setGeoCity("Geolocation error");
    }
  };

  useEffect(() => {
    if (cityInput.length > 1) {
      const debounceTimeout = setTimeout(() => {
        handleSearch();
      }, 500);

      return () => clearTimeout(debounceTimeout);
    } else {
      setSearchResults([]);
    }
  }, [cityInput]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get("weather/search", {
        params: { name: cityInput },
      });
      const data = response.data;

      if (data && data.length > 0) {
        setSearchResults(data);
        const foundCity = data[0];
        onCitySelect(foundCity.lat, foundCity.lon, foundCity.name);
        localStorage.setItem(
          "lastCity",
          JSON.stringify({
            name: foundCity.name,
            lat: foundCity.lat,
            lng: foundCity.lon,
          })
        );
        setCityName(foundCity.name);
        setCityTab("c3");
      } else {
        setSearchResults([]);
        //alert("City not found");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      // alert("Error fetching city data");
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

        <div className="input-group">
          <span onClick={handleSearch} className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            onClick={toggleSearch}
            className="form-control"
            placeholder="Search city"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div
            className={`search-div ${isSearchOpen ? "search-div-active" : ""}`}
          >
            {isSearchOpen && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((city, index) => (
                  <p
                    className="search-item"
                    key={index}
                    onClick={() => {
                      onCitySelect(city.lat, city.lon, city.name);
                      setCityInput("");
                      setIsSearchOpen(false);
                    }}
                  >
                    {city.name}, {city.country}
                  </p>
                ))}
              </div>
            )}
          </div>
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
    </div>
  );
};

export default HeaderTop;
