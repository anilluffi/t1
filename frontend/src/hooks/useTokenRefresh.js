import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getTokenExpirationTime } from "../utils/tokenUtils";
import axios from "axios";

const useTokenRefresh = () => {
  const { token, refreshToken, setTokens } = useAuthStore();

  useEffect(() => {
    if (!token || !refreshToken) return;

    const expirationTime = getTokenExpirationTime(token);
    const now = Date.now();
    const timeUntilExpiration = expirationTime - now;

    //console.log("Token expiration in:", timeUntilExpiration, "ms");//log

    if (timeUntilExpiration <= 0) {
      refreshAccessToken();
    } else {
      const refreshThreshold = timeUntilExpiration - 2000; // - 5000
      const timeoutId = setTimeout(async () => {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }, refreshThreshold);
      return () => clearTimeout(timeoutId);
    }
  }, [token, refreshToken]);

  const refreshAccessToken = async () => {
    try {

      //console.log("Отправка refresh токена на сервер:", refreshToken);//log

      const response = await axios.post("http://localhost:3000/api/auth/refresh",
        { refreshToken },
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      //log
      //console.log("Ответ сервера:", response.data);
      //console.log("Проверка наличия токенов:", response.data.access_token, response.data.refresh_token);

      if (response.data && response.data.access_token) {
        //console.log("Новый access token:", response.data.access_token); //log
        setTokens(response.data.access_token, response.data.refresh_token);
      } else {
        console.error("Token not received.");
        setTokens(null, null);
      }

    } catch (error) {
      console.error("Token update error:", error.response?.data || error); //log
      setTokens(null, null);
    }
  };


};

export default useTokenRefresh;
