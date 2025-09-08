import React from "react";

export default function Hero({ onRegister, onViewEvents }) {
    return (
        <section className="hero">
            <div className="glow pink"></div>
            <div className="glow violet"></div>
            <h1>
                Welcome to{" "}
                <span
                     style={{
                        background:
                            "linear-gradient(135deg,var(--pink),var(--violet))",
                        WebkitBackgroundClip: "text",
                        color: "black",
                    }}
                >
                    CACHE2K25
                </span>
            </h1>
            <p>
                Register for exciting Technical and Non-Technical events. Build,
                compete, create, and have fun! <br /> 
                Limited seats — register before
                the deadline.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                
            </div>
        </section>
    );
}
