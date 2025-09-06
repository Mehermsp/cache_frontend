import React, { useMemo, useState } from "react";
import { events } from "../data/events";
import { api } from "../api";
import PaymentWidget from "./PaymentWidget.jsx";

export default function RegistrationForm({ selectedEvent, onCancel }) {
    const [form, setForm] = useState({
        name: "",
        contact: "",
        email: "",
        college: "",
        rollNumber: "",
        eventId: selectedEvent?.id || events[0].id,
        utr: "",
        paymentPhone: "",
        gameId: "", // For esports primary participant
        teamMembers: [], // Array for team member details
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const ev = useMemo(
        () => events.find((e) => e.id === form.eventId),
        [form.eventId]
    );

    // Handle primary participant form changes
    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Handle team member form changes
    function onTeamMemberChange(index, field, value) {
        const updatedTeamMembers = [...form.teamMembers];
        updatedTeamMembers[index] = {
            ...updatedTeamMembers[index],
            [field]: value,
        };
        setForm({ ...form, teamMembers: updatedTeamMembers });
    }

    // Add a new team member
    function addTeamMember() {
        if (form.teamMembers.length < ev.teamSize - 1) {
            setForm({
                ...form,
                teamMembers: [
                    ...form.teamMembers,
                    {
                        name: "",
                        contact: "",
                        email: "",
                        rollNumber: "",
                        gameId: "",
                    },
                ],
            });
        }
    }

    // Remove a team member
    function removeTeamMember(index) {
        const updatedTeamMembers = form.teamMembers.filter(
            (_, i) => i !== index
        );
        setForm({ ...form, teamMembers: updatedTeamMembers });
    }

    function onFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("contact", form.contact);
            formData.append("email", form.email);
            formData.append("college", form.college);
            formData.append("rollNumber", form.rollNumber);
            formData.append("eventId", ev.id);
            formData.append("eventName", ev.name);
            formData.append("price", ev.price);
            formData.append("paymentProof", imageFile);
            formData.append("utr", form.utr);
            formData.append("paymentPhone", form.paymentPhone);
            if (ev.requiresGameIds) {
                formData.append("gameId", form.gameId);
            }
            formData.append("teamMembers", JSON.stringify(form.teamMembers));

            const { data } = await api.post("/registrations", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess(data);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to submit");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
            {/* Left side: form */}
            <div>
                <div className="card">
                    <div className="title">Participant Details</div>
                    <form onSubmit={onSubmit}>
                        <label className="label">Full Name</label>
                        <input
                            className="input"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            required
                            placeholder="Your full name"
                        />

                        <label className="label">Contact Number</label>
                        <input
                            className="input"
                            name="contact"
                            value={form.contact}
                            onChange={onChange}
                            required
                            placeholder="Your contact number"
                        />

                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            required
                            placeholder="Your email"
                        />

                        <label className="label">College</label>
                        <input
                            className="input"
                            name="college"
                            value={form.college}
                            onChange={onChange}
                            required
                            placeholder="Your college name"
                        />

                        <label className="label">Roll Number</label>
                        <input
                            className="input"
                            name="rollNumber"
                            value={form.rollNumber}
                            onChange={onChange}
                            required
                            placeholder="Your university or college issued roll number"
                        />

                        {ev.requiresGameIds && (
                            <>
                                <label className="label">Game ID</label>
                                <input
                                    className="input"
                                    name="gameId"
                                    value={form.gameId}
                                    onChange={onChange}
                                    required
                                    placeholder="Your game ID"
                                />
                            </>
                        )}

                        {ev.teamSize > 1 && (
                            <>
                                <div
                                    className="title"
                                    style={{ marginTop: 20 }}
                                >
                                    Team Members (Max {ev.teamSize - 1})
                                </div>
                                {form.teamMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginTop: 12,
                                            borderTop:
                                                "1px solid rgba(255,255,255,.15)",
                                            paddingTop: 12,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span>Team Member {index + 1}</span>
                                            <button
                                                type="button"
                                                className="btn"
                                                style={{
                                                    background: "#ff4d4d",
                                                }}
                                                onClick={() =>
                                                    removeTeamMember(index)
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <label className="label">
                                            Full Name
                                        </label>
                                        <input
                                            className="input"
                                            value={member.name}
                                            onChange={(e) =>
                                                onTeamMemberChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            placeholder="Team member's full name"
                                        />
                                        <label className="label">
                                            Contact Number
                                        </label>
                                        <input
                                            className="input"
                                            value={member.contact}
                                            onChange={(e) =>
                                                onTeamMemberChange(
                                                    index,
                                                    "contact",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            placeholder="Team member's contact number"
                                        />
                                        <label className="label">Email</label>
                                        <input
                                            className="input"
                                            type="email"
                                            value={member.email}
                                            onChange={(e) =>
                                                onTeamMemberChange(
                                                    index,
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            placeholder="Team member's email"
                                        />
                                        <label className="label">
                                            Roll Number
                                        </label>
                                        <input
                                            className="input"
                                            value={member.rollNumber}
                                            onChange={(e) =>
                                                onTeamMemberChange(
                                                    index,
                                                    "rollNumber",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            placeholder="Team member's roll number"
                                        />
                                        {ev.requiresGameIds && (
                                            <>
                                                <label className="label">
                                                    Game ID
                                                </label>
                                                <input
                                                    className="input"
                                                    value={member.gameId}
                                                    onChange={(e) =>
                                                        onTeamMemberChange(
                                                            index,
                                                            "gameId",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder="Team member's game ID"
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                                {form.teamMembers.length < ev.teamSize - 1 && (
                                    <button
                                        type="button"
                                        className="btn"
                                        style={{ marginTop: 12 }}
                                        onClick={addTeamMember}
                                    >
                                        Add Team Member
                                    </button>
                                )}
                            </>
                        )}

                        <label className="label label-event">
                            Select Event
                        </label>
                        <select
                            name="eventId"
                            value={form.eventId}
                            className="label-events"
                            onChange={onChange}
                        >
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name} (₹{e.price})
                                </option>
                            ))}
                        </select>

                        <label className="label">UTR / Transaction ID</label>
                        <input
                            className="input"
                            name="utr"
                            value={form.utr}
                            onChange={onChange}
                            placeholder="e.g. 324562718192"
                        />

                        <label className="label">
                            PhonePe holder phone number
                        </label>
                        <input
                            className="input"
                            name="paymentPhone"
                            value={form.paymentPhone}
                            onChange={onChange}
                            placeholder="From which number you have paid?"
                        />

                        <label className="label">
                            Upload Payment Proof (screenshot)
                        </label>
                        <input
                            className="input"
                            type="file"
                            accept="image/*"
                            onChange={onFile}
                            required
                        />

                        {preview && (
                            <img
                                src={preview}
                                alt="proof"
                                style={{
                                    marginTop: 8,
                                    width: 160,
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,.15)",
                                }}
                            />
                        )}

                        <div
                            style={{ display: "flex", gap: 12, marginTop: 14 }}
                        >
                            <button
                                disabled={submitting}
                                className="btn"
                                type="submit"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Registration"}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    background:
                                        "linear-gradient(135deg,#2b2b40,#3b2a59)",
                                }}
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side: Event + Payment Widget */}
            <div>
                <div className="card">
                    <div className="title">Selected Event</div>
                    <div
                        style={{
                            display: "flex",
                            gap: 14,
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={ev.image}
                            alt={ev.name}
                            style={{
                                width: 120,
                                height: 90,
                                objectFit: "cover",
                                borderRadius: 12,
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 800 }}>{ev.name}</div>
                            <div className="small">Fee: ₹{ev.price}</div>
                            <div className="small">
                                Deadline:{" "}
                                {new Date(ev.deadline).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <PaymentWidget
                    name={form.name || "Participant"}
                    amount={ev.price}
                    note={`Reg ${ev.name}`}
                />

                {success && (
                    <div className="card" style={{ marginTop: 12 }}>
                        <div style={{ fontWeight: 800 }}>✅ Success!</div>
                        <div className="small">
                            Registration ID: {success.registrationId}
                        </div>
                        <div className="small">
                            We’ve emailed a copy. Show this at the help desk on
                            event day.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
