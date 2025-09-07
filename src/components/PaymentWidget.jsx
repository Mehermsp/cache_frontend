import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
/**
 * Simple UPI/PhonePe launcher + QR
 * On Android, clicking the UPI link opens preferred UPI app (incl. PhonePe).
 */
export default function PaymentWidget({ name, amount, note }){
    const [qr, setQr] = useState("");
    // TODO: set your org UPI ID and name
    const pa = import.meta.env.VITE_UPI_VPA || "7093279196@ybl";
    const pn = import.meta.env.VITE_UPI_NAME || "CACHE2K25";
    const tn = encodeURIComponent(note || `CACHE2K25 ${name}`);
    const am = amount?.toFixed ? amount.toFixed(2) : amount;
    const url = useMemo(() => {
  const params = new URLSearchParams({
    pa,
    pn,
    am,
    cu: "INR",
    tn,
  });
  return `upi://pay?${params.toString()}`;
}, [pa, pn, am, tn]);

    useEffect(() => {
        QRCode.toDataURL(url).then(setQr);
    }, [url]);
    return (
        <div className="card" style={{ marginTop: 12 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontWeight: 800 }}>
                        Pay with UPI / PhonePe
                    </div>
                    <div className="small">
                        Amount: ₹{am} • Payee: {pn} ({pa})
                    </div>
                </div>
                <a className="btn" href={url}>
                    Open UPI App
                </a>
            </div>
            <hr />
            <div
                style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                {qr && (
                    <img
                        src={qr}
                        alt="UPI QR"
                        style={{
                            width: 160,
                            height: 160,
                            borderRadius: 16,
                            border: "1px solid rgba(255,255,255,.15)",
                        }}
                    />
                )}
                <div className="small">
                    Scan this QR in PhonePe/Google Pay/Paytm if the button
                    doesn’t open the app.
                </div>
            </div>
        </div>
    );
}
