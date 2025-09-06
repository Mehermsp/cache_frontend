import React from "react";
import "./Navbar.css";

export default function Navbar({ onNavigate }) {
    return (
        <nav className="navbar">
            <div
                className="logo"
                onClick={() => onNavigate("home")}
                style={{ cursor: "pointer" }}
            >
                CACHE2K25
            </div>
            <ul className="nav-links">
                <li>
                    <button
                        onClick={() => onNavigate("home")}
                        className="nav-btn"
                    >
                        Home
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onNavigate("home")}
                        className="nav-btn"
                    >
                        Events
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onNavigate("register")}
                        className="nav-btn"
                    >
                        Register
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => onNavigate("admin")}
                        className="nav-btn"
                    >
                        Admin
                    </button>
                </li>
            </ul>
        </nav>
    );
}
