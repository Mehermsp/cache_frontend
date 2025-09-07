import React from "react";
import "./collegeinfo.css";

export default function CollegeInfo({ college }) {
    return (
        <div className="college-card">
            {/* College Image */}
            <div className="college-images">
                <div className="college-image">
                    <img src={college.image1} alt={college.name} />
                </div>
                <div className="college-image">
                    <img src={college.image2} alt={college.name} />
                </div>
            </div>

            {/* College Info */}
            <div className="college-details">
                <h2>{college.name}</h2>
                <p className="location">{college.location}</p>
                <p className="description">{college.description}</p>

                <div className="college-stats">
                    <div className="stat">
                        <span className="label">Established in</span>
                        <span className="value">{college.established}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Students</span>
                        <span className="value">{college.students}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Faculty</span>
                        <span className="value">{college.faculty}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Library books</span>
                        <span className="value">{college.librarybooks}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
