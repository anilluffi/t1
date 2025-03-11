import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/auth/reset-password/mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email}),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Password recovery failed");
            }

            setMessage("Message sent to email!");
            setEmail("");

            
            //setTimeout(() => navigate("/login"), 3000);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-3 text-center">
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
                <h2>Password Recovery</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

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
                    <button type="submit" className="btn text-white w-100 bg-dark">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
