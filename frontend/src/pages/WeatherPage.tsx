import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios"; 

interface ApiResponse {
    message: string;
}

const WeatherPage = () => {
    const [message, setWeather] = useState("");
    useEffect(() => {

        const fetchWeather = async () => {

        try {
            const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
            const response = await axiosInstance.get<ApiResponse>("/weather");
            setWeather(response.data.message);
          } catch (err) {
            const error = err as AxiosError;
            console.error("Ошибка запроса:", error);
            setWeather(`Ошибка загрузки данных: ${(error.response?.data as ApiResponse)?.message || "Неизвестная ошибка"}`);
          }
        }
        fetchWeather();
      }, []);

    return (
        <div className="card p-4 shadow-sm text-secondary p-3 m-5 rounded-2 pb-5">
            <p className="bi bi-sun-fill fs-2"></p>
            <p className="bi bi-cloud-fill fs-2"></p>
            <p className="bi bi-cloud-drizzle-fill fs-2"></p>
            <p className="bi bi-cloud-lightning-rain-fill fs-2"></p>
            <p className="bi bi-cloud-snow-fill fs-2"></p>
            <p className="bi bi-snow fs-2"></p>
            <p className="bi bi-cloud-sun-fill fs-2"></p>
            <p className="bi bi-clouds-fill fs-2"></p>
            <p className="bi bi-moon-fill fs-2"></p>
            <p className="bi bi-wind fs-2"></p>
            <p className="bi bi-thermometer-half fs-2"></p>
        </div>

    );
};

export default WeatherPage;
