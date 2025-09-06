import React, { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const API_BASE = "https://cache2k25-backend.onrender.com";
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${API_BASE}/api/admin/login`,
                { email, password }
            );
            localStorage.setItem("adminToken", data.token);
            // 🔑 dispatch custom event
            window.dispatchEvent(new CustomEvent("admin-login-success"));
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    
    return (
        <div
            style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}
        >
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                className="input"
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", padding: 10, margin: "10px 0" }}
                />
                <input
                className="input"
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: 10, margin: "10px 0" }}
                />
                <button
                className="btn"
                    type="submit"
                    style={{
                        width: "100%",
                        padding: 10,
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                    }}
                >
                    Login
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AdminLogin;
