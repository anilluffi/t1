import { Menu } from "./components/Menu/Menu";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WeatherPage from "./pages/WeatherPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./routes/PrivateRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <>
        <Menu />
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ChangePasswordPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<LoginPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<WeatherPage />} />
            </>
          )}
          <Route path="/profile" element={<ProfilePage />} />

          {/* <Route path="/" element={<LoginPage />} /> */}

          <Route element={<PrivateRoute />}>
            <Route path="/Home" element={<HomePage />} />
          </Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
