import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { ApiResponse, FavoriteCity } from "./type";

export const Info = () => {
  const [user, setUser] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>("auth/profile");
        //console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);
  return (
    <div className="infobx mt-3">
      <br />
      {/* <h3 className="bi bi-person-vcard fs-3">  {user?.username ?? "No username"}</h3> */}

      <h3 className="bi bi-envelope-at fs-3"> {user?.email ?? "No email"}</h3>
      <br />

      <br />
      <label className="bi bi-heart fs-3"> Following city</label>
      <br />

      <ul>
        {user?.favoriteCities?.length ? (
          user.favoriteCities.map((city) => (
            <li key={city.id}>{city.city_name}</li>
          ))
        ) : (
          <li>No favorite cities</li>
        )}
      </ul>
    </div>
  );
};
