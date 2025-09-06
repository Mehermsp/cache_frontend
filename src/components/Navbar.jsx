import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar({ onNavigate }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => onNavigate("home")}>
                CACHE2K25
            </div>

            <button className="hamburger" onClick={() => setOpen(!open)}>
                ☰
            </button>

            <ul className={`nav-links ${open ? "open" : ""}`}>
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
