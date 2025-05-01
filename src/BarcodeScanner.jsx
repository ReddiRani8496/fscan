import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function BarcodeScanner() {
  const [result, setResult] = useState("");
  const [barcodes, setBarcodes] = useState([]);

  // Send scanned code to backend when result changes
  useEffect(() => {
    console.log("Scanned code:", result);
    if (result) {
      fetch("https://scan-production-9cb3.up.railway.app/api/barcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: result }),
      })
        .then((res) => res.json())
        .then(() => fetchBarcodes())
        .catch((err) => console.error("Error saving barcode:", err));
    }
    // eslint-disable-next-line
  }, [result]);

  // Fetch all scanned barcodes from backend
  const fetchBarcodes = () => {
    fetch("https://scan-production-9cb3.up.railway.app/api/barcodes")
      .then((res) => res.json())
      .then((data) => setBarcodes(data))
      .catch((err) => console.error("Error fetching barcodes:", err));
  };

  // Initial fetch
  useEffect(() => {
    fetchBarcodes();
  }, []);

  return (
    <div>
      <h2>Barcode Scanner</h2>
      <div style={{ width: 600, height: 600, margin: "auto" }}>
        <Scanner
          onResult={(text, data) => setResult(text)}
          onError={(error) => console.error(error)}
          // width and height props are ignored by this library
        />
      </div>
      <p>
        <strong>Scanned:</strong> {result}
      </p>
      <h3>All Scanned Barcodes</h3>
      <ul>
        {barcodes.map((b) => (
          <li key={b.id || b._id || b.code}>{b.code}</li>
        ))}
      </ul>
    </div>
  );
}

export default BarcodeScanner;
