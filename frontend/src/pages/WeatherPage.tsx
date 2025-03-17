import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";

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
  const [weather, setWeather] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>(""); 
  const token = localStorage.getItem('token');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const response = await fetch("http://localhost:3000/api/auth/favorite-city", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ city: selectedCity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось добавить город в избранное");
      }

      alert(`Город ${selectedCity} добавлен в избранное!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await axiosInstance.get<ApiResponse>(`auth/weather?lat=${latitude}&lon=${longitude}`
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

  return (
    <div className="p-0 m-5 shadow-sm text-secondary rounded-2 pb-5">
      {weather ? (
        <>
          <p className="m-3 fs-4 ">Ваш город: {weather.city}</p>
        </>
      ) : (
        !error && <p>Загружаем данные о погоде...</p>
      )}

      <div className="d-flex justify-content-center align-items-center gap-5 p-4">
       

        {weather ? (
          <>
            <div
              className="rounded-3 bg-secondary text-white p-3"
              style={{ width: "250px", height: "150px" }}
            >
              <h4>Сейчас</h4>
              <p>{weather.weatherNow}</p>
            </div>
            <div
              className="rounded-3 bg-secondary text-white p-3"
              style={{ width: "250px", height: "150px" }}
            >
              <h4>Через 3 часа</h4>
              <p>{weather.weatherAfter3h}</p>
            </div>
            <div
              className="rounded-3 bg-secondary text-white p-3"
              style={{ width: "250px", height: "150px" }}
            >
              <h4>Через 6 часов</h4>
              <p>{weather.weatherAfter6h}</p>
            </div>
          </>
        ) : (
          !error && <p>Загружаем данные о погоде...</p>
        )}
      </div>
      {error && <p>{error}</p>}
      {isAuthenticated ? (
        <>
          <div className="d-flex justify-content-center align-items-center gap-5 p-4">
            {weather ? (
              <>
                <div
                  className="rounded-3 bg-secondary text-white p-3"
                  style={{ width: "250px", height: "150px" }}
                >
                  <h4>Сегодня</h4>
                  <p>{weather.weatherNow}</p>
                </div>

                {weather.weekForecast?.map((day, index) => (
                  <div
                    key={index}
                    className="rounded-3 bg-secondary text-white p-3"
                    style={{ width: "250px", height: "150px" }}
                  >
                    <h4>{day.date}</h4>
                    <p>
                      {day.temp}°C, {day.description}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              !error && <p>Загружаем данные о погоде...</p>
            )}
          </div>

          <div className="m-3">
            <form onSubmit={handleSubmit}>
              <label>Выберите ваш любимый город</label>

              <select
                className="form-select form-select-lg mt-3"
                style={{ width: "200px" }}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {[
                  "Киев",
                  "Харьков",
                  "Одесса",
                  "Днепр",
                  "Донецк",
                  "Львов",
                  "Запорожье",
                  "Кривой Рог",
                  "Николаев",
                  "Полтава",
                ].map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn text-white mt-3 bg-dark"
                style={{ width: "200px" }}
              >
                Подтвердить
              </button>
            </form>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WeatherPage;
