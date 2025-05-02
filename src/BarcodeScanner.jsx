import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { BarcodeFormat } from "@yudiel/react-qr-scanner";

function BarcodeScanner() {
  const [result, setResult] = useState("");
  const [barcodes, setBarcodes] = useState([]);

  useEffect(() => {
    console.log("Scanned result:", result);
    if (result) {
      fetch("https://scan-production-500c.up.railway.app/api/barcodes", {
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

  const fetchBarcodes = () => {
    fetch("https://scan-production-500c.up.railway.app/api/barcodes")
      .then((res) => res.json())
      .then((data) => setBarcodes(data))
      .catch((err) => console.error("Error fetching barcodes:", err));
  };

  useEffect(() => {
    fetchBarcodes();
  }, []);

  return (
    <div>
      <h2>Barcode Scanner</h2>
      <div style={{ width: 300, height: 300, margin: "auto" }}>
        <Scanner
          formats={[
            "ean_13",
            "code_128",
            "qr_code",
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODE_39,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.QR_CODE,
            // add more formats as needed: 'upc_a','upc_e','code_39',...
          ]}
          onScan={(detected) => {
            console.log("Detected:", detected);
            if (detected && detected.length > 0) {
              // Only update if new code is detected
              setResult(detected[0].rawValue);
            }
          }}
          onError={(error) => console.error(error)}
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
