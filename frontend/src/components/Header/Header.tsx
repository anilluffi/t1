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
          {/* <a href="/Password" className="p-3 text-light" >
          <i className="bi bi-key fs-3"></i>
          </a> */}

          <a href="/weather" className="p-3 text-light">
            <i className="bi bi-cloud-sun fs-3"></i>
          </a>



          {!isAuthenticated ? (
            <>
              <a href="/Login" className="p-3 text-light" >
              <i className="bi bi-person-check fs-3"></i>
              </a>
              <a href="/register" className="p-3 text-light" >
              <i className="bi bi-person-add fs-3"></i>
              </a>
            </>
          ) : (
            <>
              <a href="/Home" className="p-3 text-light" >
              <i className="bi bi-house fs-3"></i></a>

              <a href="/profile" className="p-4 text-light" >
                <i className="bi bi-person fs-3"></i>
              </a>

              
              
              <button className="text-white bg-dark bg-gradient ms-5 rounded" onClick={handleLogout}>
              <i className="bi bi-person-x fs-5"></i>
              </button>
            </>
          )}


        </nav>
      </div>
    </header>
  );
};
