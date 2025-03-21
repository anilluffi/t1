import React, { useState, useEffect } from "react";
import "./style.css";

export const Menu = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
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
    <div>
      <div className="container-menu">
        <button
          className="bi bi-list fs-3 text-black p-3"
          onClick={toggleMenu}
        ></button>

        <nav className={`menu ${isMenuOpen ? "menu-active" : ""}`}>
          <button
            className="bi bi-list fs-3 text-black p-3"
            onClick={toggleMenu}
          ></button>
          <a href="/weather" className="p-3 text-secondary">
            <i className="bi bi-cloud-sun fs-3"></i>
          </a>

          {!isAuthenticated ? (
            <>
              <a href="/Login" className="p-3 text-secondary">
                <i className="bi bi-person-check fs-3"></i>
              </a>
              <a href="/register" className="p-3 text-secondary">
                <i className="bi bi-person-add fs-3"></i>
              </a>
            </>
          ) : (
            <>
              <a href="/Home" className="p-3 text-secondary">
                <i className="bi bi-house fs-3"></i>
              </a>

              <a href="/profile" className="p-4 text-secondary">
                <i className="bi bi-person fs-3"></i>
              </a>

              <button className="text-secondary" onClick={handleLogout}>
                <i className="bi bi-person-x fs-3"></i>
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
