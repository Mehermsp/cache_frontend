import React, { useEffect, useMemo, useState } from "react";
import { api, setAuth } from "../api";
import { events } from "../data/events";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AdminDashboard() {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [eventFilter, setEventFilter] = useState("");
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [showRevenue, setShowRevenue] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            window.location.hash = "admin";
            return;
        }

        setAuth(token);

        api.get("/registrations/admin")
            .then((r) => {
                setRows(r.data);
            })
            .catch((err) => {
                console.error(
                    "❌ Failed to fetch registrations:",
                    err.response?.data || err.message
                );
                if (err.response?.status === 401) {
                    localStorage.removeItem("adminToken");
                    window.location.hash = "admin";
                }
            });
    }, []);

    const filtered = useMemo(() => {
        const s = q.toLowerCase();
        return rows.filter((r) => {
            const matchesSearch = [
                r.registrationId,
                r.name,
                r.contact,
                r.email,
                r.college,
                r.rollNumber,
                r.eventName,
                r.utr,
                r.paymentPhone,
                r.gameId,
                ...(r.teamMembers || []).flatMap((m) => [
                    m.name,
                    m.contact,
                    m.email,
                    m.rollNumber,
                    m.gameId,
                ]),
            ].some((x) => (x || "").toLowerCase().includes(s));

            const matchesEvent = !eventFilter || r.eventName === eventFilter;

            return matchesSearch && matchesEvent;
        });
    }, [rows, q, eventFilter]);

    const revenueSummary = useMemo(() => {
        const summary = events.map((ev) => ({
            eventName: ev.name,
            revenue: 0,
            verifiedCount: 0,
        }));

        const summaryMap = {};
        summary.forEach((s) => {
            summaryMap[s.eventName] = s;
        });

        filtered.forEach((r) => {
            if (r.verified) {
                summaryMap[r.eventName].revenue += r.transactionAmount || 0;
                summaryMap[r.eventName].verifiedCount += 1;
            }
        });

        const totalRevenue = summary.reduce((acc, s) => acc + s.revenue, 0);

        return { summary, totalRevenue };
    }, [filtered]);

    const downloadExcel = (registrations) => {
        if (!registrations || registrations.length === 0) {
            alert("No data available to download");
            return;
        }

        const data = registrations.map((r) => ({
            registrationId: r.registrationId,
            name: r.name,
            contact: r.contact,
            email: r.email,
            college: r.college,
            rollNumber: r.rollNumber,
            eventName: r.eventName,
            transactionDate: new Date(r.transactionDate).toLocaleString(),
            transactionAmount: `₹${r.transactionAmount}`,
            utr: r.utr,
            paymentPhone: r.paymentPhone,
            gameId: r.gameId || "N/A",
            teamMembers: r.teamMembers
                ? r.teamMembers.map((m) => m.name).join(", ")
                : "N/A",
            teamGameIds: r.teamMembers
                ? r.teamMembers.map((m) => m.gameId || "N/A").join(", ")
                : "N/A",
            verified: r.verified ? "Yes" : "No",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "registrations.xlsx");
    };

    const toggleVerify = async (r) => {
        try {
            const newVerified = !r.verified;
            await api.patch(`/registrations/${r._id}/verify`, {
                verified: newVerified,
            });
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row._id === r._id ? { ...row, verified: newVerified } : row
                )
            );
        } catch (err) {
            alert("Failed to update verification status");
        }
    };

    const downloadTicketDetails = (r) => {
        const event = events.find((ev) => ev.name === r.eventName);
        const isEsports = event?.requiresGameIds || false;

        // Generate text content
        let teamMembersText = "";
        if (r.teamMembers && r.teamMembers.length > 0) {
            teamMembersText = r.teamMembers
                .map((m, index) =>
                    isEsports
                        ? `Team Member ${index + 1}: ${m.name} (Game ID: ${
                              m.gameId || "N/A"
                          })`
                        : `Team Member ${index + 1}: ${m.name}`
                )
                .join("\n");
        }

        const textContent = `Cache2k25 Event Ticket
College Logo URL: https://res.cloudinary.com/your-cloudinary-id/image/upload/cache2k25/logo.png
Registration ID: ${r.registrationId}
Event: ${r.eventName}
Primary Participant: ${r.name}
${isEsports && r.gameId ? `Game ID: ${r.gameId}` : ""}
${teamMembersText ? `Team Members:\n${teamMembersText}` : ""}
Note: Please present this ticket at the Cache2k25 help desk on the event day.`;

        // Create blob for text content
        const blob = new Blob([textContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-details-${r.registrationId}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const closeModal = () => {
        setSelectedRegistration(null);
    };

    const closeRevenueModal = () => {
        setShowRevenue(false);
    };

    return (
        <div style={{ marginTop: 24 }}>
            <div
                className="controls"
                style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <input
                    className="input search"
                    style={{ flex: 2 }}
                    placeholder="Search by any field"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="input select label-events"
                    style={{ flex: 1 }}
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                >
                    <option value="">All Events</option>
                    {events.map((ev) => (
                        <option key={ev.id} value={ev.name}>
                            {ev.name}
                        </option>
                    ))}
                </select>
                <button className="btn" onClick={() => downloadExcel(filtered)}>
                    Download Excel
                </button>
                <button className="btn" onClick={() => setShowRevenue(true)}>
                    Show Revenue
                </button>
            </div>

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Registration ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>College</th>
                            <th>Roll No</th>
                            <th>Event</th>
                            <th>Txn Date</th>
                            <th>Amount</th>
                            <th>UTR</th>
                            <th>Payment Phone</th>
                            <th>Proof</th>
                            <th>Team</th>
                            <th>Verified</th>
                            <th>Ticket Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r) => (
                            <tr key={r._id}>
                                <td>{r.registrationId}</td>
                                <td>{r.name}</td>
                                <td>{r.contact}</td>
                                <td>{r.email}</td>
                                <td>{r.college}</td>
                                <td>{r.rollNumber}</td>
                                <td>
                                    <span className="tag">{r.eventName}</span>
                                </td>
                                <td>
                                    {new Date(
                                        r.transactionDate
                                    ).toLocaleString()}
                                </td>
                                <td>₹{r.transactionAmount}</td>
                                <td>{r.utr}</td>
                                <td>{r.paymentPhone}</td>
                                <td>
                                    {r.paymentProof ? (
                                        <a
                                            href={r.paymentProof}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={r.paymentProof}
                                                alt="Proof"
                                                style={{
                                                    width: 60,
                                                    borderRadius: 6,
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn"
                                        style={{ background: "#007bff" }}
                                        onClick={() =>
                                            setSelectedRegistration(r)
                                        }
                                    >
                                        View Team
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn"
                                        style={{
                                            background: r.verified
                                                ? "#ff4d4d"
                                                : "#28a745",
                                        }}
                                        onClick={() => toggleVerify(r)}
                                    >
                                        {r.verified ? "Unverify" : "Verify"}
                                    </button>
                                </td>
                                <td>
                                    {r.verified ? (
                                        <button
                                            className="btn"
                                            style={{ background: "#17a2b8" }}
                                            onClick={() =>
                                                downloadTicketDetails(r)
                                            }
                                        >
                                            Download Ticket Details
                                        </button>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedRegistration && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: 600,
                            width: "90%",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: 20,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div className="title">Team Details</div>
                            <button
                                className="btn"
                                style={{ background: "#ff4d4d" }}
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <h4>Primary Participant</h4>
                            <div className="small">
                                Name: {selectedRegistration.name}
                            </div>
                            <div className="small">
                                Contact: {selectedRegistration.contact}
                            </div>
                            <div className="small">
                                Email: {selectedRegistration.email}
                            </div>
                            <div className="small">
                                Roll Number: {selectedRegistration.rollNumber}
                            </div>
                            {selectedRegistration.gameId && (
                                <div className="small">
                                    Game ID: {selectedRegistration.gameId}
                                </div>
                            )}
                        </div>
                        {selectedRegistration.teamMembers &&
                            selectedRegistration.teamMembers.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <h4>Team Members</h4>
                                    {selectedRegistration.teamMembers.map(
                                        (member, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    marginTop: 12,
                                                    borderTop:
                                                        "1px solid rgba(255,255,255,.15)",
                                                    paddingTop: 12,
                                                }}
                                            >
                                                <div className="small">
                                                    Name: {member.name}
                                                </div>
                                                <div className="small">
                                                    Contact: {member.contact}
                                                </div>
                                                <div className="small">
                                                    Email: {member.email}
                                                </div>
                                                <div className="small">
                                                    Roll Number:{" "}
                                                    {member.rollNumber}
                                                </div>
                                                {member.gameId && (
                                                    <div className="small">
                                                        Game ID: {member.gameId}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            )}

            {showRevenue && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="card"
                        style={{
                            maxWidth: 600,
                            width: "90%",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: 20,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div className="title">Revenue Summary</div>
                            <button
                                className="btn"
                                style={{ background: "#ff4d4d" }}
                                onClick={closeRevenueModal}
                            >
                                Close
                            </button>
                        </div>
                        <table className="table" style={{ marginTop: 16 }}>
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Verified Registrations</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {revenueSummary.summary.map((s) => (
                                    <tr key={s.eventName}>
                                        <td>{s.eventName}</td>
                                        <td>{s.verifiedCount}</td>
                                        <td>₹{s.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: 16, fontWeight: "bold" }}>
                            Total Revenue: ₹{revenueSummary.totalRevenue}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
