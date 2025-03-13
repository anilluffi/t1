import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";

interface ApiResponse {
    id: number;
    email: string;
    username?: string;
  }
  
  const ProfilePage = () => {
    const [user, setUser] = useState<ApiResponse | null>(null);
  
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
      <div className="card p-4 shadow-sm text-secondary m-5 rounded-2 pb-5">
        <h1 className="bi bi-person fs-3"> Profile </h1> <br />
  
        <div
          className="overflow-hidden bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white"
          style={{ width: "150px", height: "150px" }}
        >
          <img
            style={{ width: "150px", height: "150px" }}
            src="https://res.cloudinary.com/degtrhf0k/image/upload/t_190/v1741861952/download_ethk23.png"
            alt="avatar"
          />
        </div>
  
        <form action="" method="POST" className="avatar-upload-form">
          <label htmlFor="avatar" className="bi bi-pencil-square fs-3"></label>
          <input
            style={{ display: "none" }}
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
          />
        </form>
  
        <div className="infobx mt-5">
          <br />
          {/* <h3 className="bi bi-person-vcard fs-3">  {user?.username ?? "No username"}</h3> */}
  
          <h3 className="bi bi-envelope-at fs-3">  {user?.email ?? "No email"}</h3>
          <br />
  
          <label className="bi bi-heart fs-3"> Following city</label>
          <br />
          <select className="form-select form-select-lg mt-3 w-25">
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
              <option key={index} value={index + 1}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;
  