import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero.jsx";
import EventsGrid from "./components/EventsGrid.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import CollegeInfo from "./components/CollegeInfo.jsx";

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

    const college = {
        name: "VSM College of Engineering",
        location:
            "MAIN ROAD, RAMACHANDRAPURAM - Pin:533255, Konaseema District, Andhra Pradesh,INDIA.",
        description:
            "VSM College of Engineering was established in 2009 by the Ramachandrapuram Educational Society. It is affiliated with JNTU – Kakinada and is one of the leading institutions in the region. The college was started to meet the changing needs of society, industry, and services, especially with the growing focus on innovation, research, and new teaching methods. Even with tough competition due to globalization, the institution is working hard to prepare graduates who meet global standards. The college aims to become a leader in technical and management education in Konaseema district and across the state, building a strong reputation for quality education and skilled professionals.",
        established: "2009",
        students: "5000+",
        faculty:"300+",
        librarybooks: "27000+",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/IIT_Bombay_Main_Building.jpg/640px-IIT_Bombay_Main_Building.jpg",
    };

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
                        <button className="btn" style={{ marginTop: 32 }} onClick={() => setPage("events")}>Explore Events</button>
                        <CollegeInfo college={college} />
                    </>
                )}
                {page === "events" && (
                    <>
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
