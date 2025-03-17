import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";


interface FavoriteCity {
  id: number;
  city_name: string;
}

interface ApiResponse {
  id: number;
  email: string;
  username?: string;
  favoriteCities: FavoriteCity[];
}


const ProfilePage = () => {
  const [user, setUser] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const response = await fetch("http://localhost:3000/api/auth/set-avarar", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось добавить загрузить изображение");
      }

    } catch (err: any) {
      setError(err.message);
    }
  };


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
        className="overflow-hidden rounded-circle d-flex justify-content-center align-items-center text-white"
        style={{ width: "150px", height: "150px" }}
      >
        <img
          style={{ width: "150px", height: "150px" }}
          src="https://res.cloudinary.com/degtrhf0k/image/upload/t_190/v1741861952/download_ethk23.png"
          alt="avatar"
        />
      </div>




      <form onSubmit={handleSubmit} method="POST" className="avatar-upload-form">
        <label htmlFor="avatar" className="bi bi-pencil-square fs-3"></label>
        <input
          style={{ display: "none" }}
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
        />
        <button className="btn text-secondary bg-white mb-3 bi bi-floppy-fill fs-3" type="submit"></button>
      </form>




      <div className="infobx mt-3">
        <br />
        {/* <h3 className="bi bi-person-vcard fs-3">  {user?.username ?? "No username"}</h3> */}

        <h3 className="bi bi-envelope-at fs-3">  {user?.email ?? "No email"}</h3>
        <br />



        <button className="text-white bg-dark mb-5 rounded" >
        <a className="text-white link-underline-dark" href="/Password">reset password</a>
        </button>
        



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
    </div>
  );
};

export default ProfilePage;
