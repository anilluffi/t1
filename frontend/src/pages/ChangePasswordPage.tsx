import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ChangePasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!token) {
            setMessage("Invalid token");
            setIsSuccess(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/confirm",
                { password },
                { params: { token } }
            );

            setMessage("Password successfully changed");
            setIsSuccess(true);
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.message || "Failed to reset password");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    setIsAuthenticated(!!token);
        if (isSuccess) {
            const timeout = setTimeout(() => {
                navigate(isAuthenticated ? "/Home" : "/login");
            }, 1500);
    
            return () => clearTimeout(timeout); 
        }
    }, [isSuccess, navigate, isAuthenticated]);
    

    return (
        <div className="container mt-3 text-center">
            <h2>Password Reset</h2>
            {message && <p>{message}</p>}

            {!isSuccess && (
                <form onSubmit={handleSubmit} className="text-start mx-auto" style={{ maxWidth: "400px" }}>
                    <div className="mb-3">
                        <label className="form-label">New Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn text-white w-100 bg-dark" disabled={loading}>
                        {loading ? "Processing..." : "Change Password"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChangePasswordPage;
