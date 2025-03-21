import { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
interface ApiResponse {
  id: number;
  avatar?: string;
}
export const Avatar = () => {
  const [user, setUser] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileInput = document.getElementById("avatar") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Выберите файл!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/set-avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось загрузить изображение");
      }

      setUser((prev) => prev && { ...prev, avatar: data.avatarPath });
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
    <>
      <div
        className="overflow-hidden rounded-circle d-flex justify-content-center align-items-center text-white"
        style={{ width: "150px", height: "150px" }}
      >
        <img
          style={{ width: "150px", height: "150px" }}
          src={
            user?.avatar
              ? `http://localhost:3000/api/auth/avatar/${user.id}`
              : "https://res.cloudinary.com/degtrhf0k/image/upload/t_190/v1741861952/download_ethk23.png"
          }
          alt="avatar"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="avatar-upload-form"
      >
        <label htmlFor="avatar" className="bi bi-pencil-square fs-3"></label>
        <input
          style={{ display: "none" }}
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
        />
        <button
          className="btn text-secondary bg-white mb-3 bi bi-floppy-fill fs-3"
          type="submit"
        ></button>
      </form>
    </>
  );
};
