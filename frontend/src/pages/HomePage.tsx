import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios"; 

interface ApiResponse {
  message: string;
}

const HomePage = () => {
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>("/message");
        setMessage(response.data.message);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Ошибка запроса:", error);
        setMessage(`Ошибка загрузки данных: ${(error.response?.data as ApiResponse)?.message || "Неизвестная ошибка"}`);
      }
    };
  
    fetchMessage();
  }, []);
  

  return (
    <div className="bg-secondary bg-gradient text-white p-3 m-5 rounded-2">
      <p>{message}</p>
    </div>
  );
};

export default HomePage;
