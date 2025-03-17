import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const setTokens = useAuthStore((state) => state.setTokens);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            setTokens(data.access_token, data.refresh_token);
            setSuccessMessage("Login successful!");

            setTimeout(() => {
                navigate("/home");
                window.location.reload(); // 

            }, 1000);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-3 text-center">
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
                <h2>Log in</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="text-start">
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="text-white bg-dark bg-gradient mb-5 rounded" >
                        <a className="text-white link-underline-dark" href="/Password">reset password</a>
                    </button>
                    <button type="submit" className="btn text-white w-100 bg-dark">Log in</button>

                </form>
            </div>
        </div>
    );
};

export default LoginPage;
