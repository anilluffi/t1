import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { AxiosError } from "axios";
import citiesData from "../../../ua-cities.json";
import { ApiResponse } from "./type";

export const FavoriteCity = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<ApiResponse | null>(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await axiosInstance.get<ApiResponse>(
          `auth/weather?lat=${latitude}&lon=${longitude}`
        );
        setWeather(response.data);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Ошибка запроса:", error);
        setWeather(null);
        setError("Не удалось получить погоду");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Не удалось получить геопозицию");
        }
      );
    } else {
      setError("Геолокация не поддерживается вашим браузером");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/city/favorite-city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ city: selectedCity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Не удалось добавить город в избранное"
        );
      }

      alert(`Город ${selectedCity} добавлен в избранное!`);
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="m-3">
      <form onSubmit={handleSubmit}>
        <label>Choose your favorite city</label>

        <select
          className="form-select form-select-lg mt-3"
          style={{ width: "200px" }}
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {citiesData[0].regions.map((region, regionIndex) => (
            <React.Fragment key={regionIndex}>
              <option disabled style={{ fontWeight: "bold" }}>
                {region.name}
              </option>
              {region.cities
                .filter((city) => city.name !== weather?.city)
                .map((city, cityIndex) => (
                  <option
                    key={`${regionIndex}-${cityIndex}`}
                    value={city.name}
                    style={{ paddingLeft: "20px" }}
                  >
                    &nbsp;&nbsp;&nbsp;{city.name}
                  </option>
                ))}
            </React.Fragment>
          ))}
        </select>

        <button
          type="submit"
          className="btn text-white mt-3 bg-dark"
          style={{ width: "200px" }}
        >
          Confirm
        </button>
      </form>
    </div>
  );
};
