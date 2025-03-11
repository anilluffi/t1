import { jwtDecode } from "jwt-decode";

export const getTokenExpirationTime = (token) => {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000;  
};
