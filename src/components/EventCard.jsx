import React from 'react';
export default function EventCard({ ev, onSelect }){
    return (
        <div className="card">
            <div className="image">
                <img src={ev.image} alt={ev.name} />
            </div>
            <div className="title">{ev.name}</div>
            <div className="desc">{ev.description}</div>
            <div className="row" style={{ marginTop: 8 }}>
                <span className="badge">{ev.category}</span>
                <span className="price">₹{ev.price}</span>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
                <span className="small">
                    Deadline:{" "}
                    {new Date(ev.deadline).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </span>
                <button className="btn" onClick={onSelect}>
                    Register
                </button>
            </div>
        </div>
    );
}
