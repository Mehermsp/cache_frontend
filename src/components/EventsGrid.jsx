import React from "react";
import { events } from "../data/events";
import EventCard from "./EventCard.jsx";
export default function EventsGrid({ onSelect }) {
    const groups = {
        technical: events.filter((e) => e.category === "technical"),
        non: events.filter((e) => e.category === "non-technical"),
    };
    return (
        <div style={{ marginTop: 18 }}>
            <h3>Technical</h3>
            <div className="grid grid-3" style={{ marginTop: 12 }}>
                {groups.technical.map((ev) => (
                    <EventCard
                        key={ev.id}
                        ev={ev}
                        onSelect={() => onSelect(ev)}
                    />
                ))}
            </div>
            <h3 style={{ marginTop: 28 }}>Non‑Technical</h3>
            <div className="grid grid-3" style={{ marginTop: 12 }}>
                {groups.non.map((ev) => (
                    <EventCard
                        key={ev.id}
                        ev={ev}
                        onSelect={() => onSelect(ev)}
                    />
                ))}
            </div>
        </div>
    );
}
