import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 

const HomePage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessage = async () => {
      const storedToken = localStorage.getItem("token"); 

      if (!storedToken) {
        console.error("No token found, redirecting to login.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/message", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${storedToken}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 401) {
          console.error("Unauthorized: Token might be expired or invalid.");
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessage("Error loading data.");
      }
    };

    fetchMessage();
  }, [navigate]); 

  return (
    <div className="bg-secondary bg-gradient text-white p-3 m-5 rounded-2">
      <p>{message}</p>
    </div>
  );
};

export default HomePage;
