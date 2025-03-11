import { useState, useEffect } from "react";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    window.location.href = "/Login";
  };

  return (
    
    <header className="bg-secondary bg-gradient text-white p-3">
      <div className="container">
        <nav>
          <a href="/Password" className="p-1" style={{ color: "white", marginRight: "15px" }}>
          <i className="bi bi-key fs-3"></i>
          </a>

          {!isAuthenticated ? (
            <>
              <a href="/Login" className="p-1" style={{ color: "white", marginRight: "15px" }}>
              <i className="bi bi-person-check fs-3"></i>
              </a>
              <a href="/register" className="p-3" style={{ color: "white" }}>
              <i className="bi bi-person-add fs-3"></i>
              </a>
            </>
          ) : (
            <>
              <a href="/Home" className="p-1" style={{ color: "white" }}>
              <i className="bi bi-house fs-3"></i>
              </a><button className="text-white bg-dark bg-gradient ms-5 rounded" onClick={handleLogout}>
              <i className="bi bi-person-x fs-5"></i>
              </button>
            </>
          )}


        </nav>
      </div>
    </header>
  );
};
