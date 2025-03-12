import { Header } from "./components/Header/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
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
        <Header />
        <Routes>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ChangePasswordPage/>} />
          {!isAuthenticated ? (
            <>
            <Route path="/" element={<LoginPage />} />
            </>): (<>
              <Route path="/" element={<HomePage />} />
            </>)
          }
          <Route path="/" element={<LoginPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/Home" element={<HomePage />} />
          </Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
