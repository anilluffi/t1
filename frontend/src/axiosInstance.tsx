import axios, { AxiosError } from "axios";
import { useAuthStore } from "./store/authStore";

const API_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Токен истек, обновление");

      try {
        const { refreshToken, setTokens } = useAuthStore.getState();
        if (!refreshToken) throw new Error("Нет refresh-токена");

        console.log("Отправляем refreshToken:", refreshToken);

        const refreshResponse = await axios.post(
            `${API_URL}/auth/refresh`,
            { refreshToken } 
          );
          
        /*const refreshResponse = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          );*/
          ////

        if (refreshResponse.data?.access_token) {
          console.log("Токен обновлен");
          setTokens(refreshResponse.data.access_token, refreshResponse.data.refresh_token);

          
          error.config.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          return axiosInstance(error.config);
        } else {
          console.error("Новый токен не получен.");
        }
      } catch (refreshError) {
        console.error("Ошибка обновления токена:", (refreshError as AxiosError).response?.data || refreshError);
        useAuthStore.getState().logout(); 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
