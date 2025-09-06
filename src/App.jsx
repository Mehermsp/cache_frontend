import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero.jsx";
import EventsGrid from "./components/EventsGrid.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

function App() {
    const [page, setPage] = useState("home");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const goHome = () => {
        setSelectedEvent(null);
        setPage("home");
    };
    useEffect(() => {
        function handleLoginSuccess() {
            setIsAdminLoggedIn(true);
            setPage("dashboard");
        }
        window.addEventListener("admin-login-success", handleLoginSuccess);
        return () =>
            window.removeEventListener(
                "admin-login-success",
                handleLoginSuccess
            );
    }, []);

    return (
        <>
            <Navbar
                onNavigate={(p) => {
                    if (p === "dashboard" && !isAdminLoggedIn) {
                        setPage("admin"); // force login if not authenticated
                    } else {
                        setPage(p);
                    }
                }}
            />

            <div className="container">
                {page === "home" && (
                    <>
                        <Hero
                            onRegister={() => setRoute("register")}
                            onViewEvents={() => setRoute("events")}
                        />

                        <h2 style={{ marginTop: 32 }}>Explore Events</h2>
                        <EventsGrid
                            onSelect={(event) => {
                                setSelectedEvent(event);
                                setPage("register");
                            }}
                        />
                    </>
                )}

                {page === "register" && (
                    <RegistrationForm
                        selectedEvent={selectedEvent}
                        onCancel={() => setPage("home")}
                    />
                )}

                {page === "admin" && (
                    <AdminLogin
                        onSuccess={() => {
                            setIsAdminLoggedIn(true);
                            setPage("dashboard");
                        }}
                    />
                )}

                {page === "dashboard" && <AdminDashboard onBack={goHome} />}
            </div>
        </>
    );
}

export default App;
