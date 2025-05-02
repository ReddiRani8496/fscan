// import React, { useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";

// function BarcodeScanner() {
//   const [result, setResult] = useState("");
//   const [barcodes, setBarcodes] = useState([]);

//   useEffect(() => {
//     console.log("Scanned result:", result);
//     if (result) {
//       fetch("https://scan-production-500c.up.railway.app/api/barcodes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code: result }),
//       })
//         .then((res) => res.json())
//         .then(() => fetchBarcodes())
//         .catch((err) => console.error("Error saving barcode:", err));
//     }
//     // eslint-disable-next-line
//   }, [result]);

//   const fetchBarcodes = () => {
//     fetch("https://scan-production-500c.up.railway.app/api/barcodes")
//       .then((res) => res.json())
//       .then((data) => setBarcodes(data))
//       .catch((err) => console.error("Error fetching barcodes:", err));
//   };

//   useEffect(() => {
//     fetchBarcodes();
//   }, []);

//   return (
//     <div>
//       <h2>Barcode Scanner</h2>
//       <div style={{ width: 300, height: 300, margin: "auto" }}>
//         <Scanner
//           formats={[
//             "code_128",
//             "code_39",
//             "ean_13",
//             "ean_8",
//             "upc_a",
//             "upc_e",
//             "qr_code",
//           ]}
//           onScan={(detected) => {
//             console.log("Detected:", detected);
//             if (detected && detected.length > 0) {
//               // Only update if new code is detected
//               setResult(detected[0].rawValue);
//             }
//           }}
//           onError={(error) => console.error(error)}
//         />
//       </div>
//       <p>
//         <strong>Scanned:</strong> {result}
//       </p>
//       <h3>All Scanned Barcodes</h3>
//       <ul>
//         {barcodes.map((b) => (
//           <li key={b.id || b._id || b.code}>{b.code}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default BarcodeScanner;

import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function BarcodeScanner() {
  const [result, setResult] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    productName: "",
    mrp: "",
    discount: "",
    weight: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch all barcodes on mount
  useEffect(() => {
    fetchBarcodes();
  }, []);

  // Handle new scan
  useEffect(() => {
    if (result) {
      const exists = barcodes.some((b) => b.code === result);
      if (exists) {
        setShowForm(false);
        setForm({
          code: "",
          productName: "",
          mrp: "",
          discount: "",
          weight: "",
        });
        alert("Barcode already exists. No need to add product.");
      } else {
        setForm({
          code: result,
          productName: "",
          mrp: "",
          discount: "",
          weight: "",
        });
        setShowForm(true);
      }
    }
    // eslint-disable-next-line
  }, [result, barcodes]);

  const fetchBarcodes = () => {
    fetch("https://scan-production-500c.up.railway.app/api/barcodes")
      .then((res) => res.json())
      .then((data) => setBarcodes(data))
      .catch((err) => console.error("Error fetching barcodes:", err));
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!form.productName) errors.productName = true;
    if (!form.mrp) errors.mrp = true;
    if (!form.discount) errors.discount = true;
    if (!form.weight) errors.weight = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    fetch("https://scan-production-500c.up.railway.app/api/barcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBarcodes();
        setShowForm(false);
        setForm({
          code: "",
          productName: "",
          mrp: "",
          discount: "",
          weight: "",
        });
        setResult(""); // Reset scanner result
      })
      .catch((err) => console.error("Error saving product:", err));
  };

  return (
    <div>
      <h2>Barcode Scanner</h2>
      <div style={{ width: 300, height: 300, margin: "auto" }}>
        <Scanner
          formats={[
            "code_128",
            "code_39",
            "ean_13",
            "ean_8",
            "upc_a",
            "upc_e",
            "qr_code",
          ]}
          onScan={(detected) => {
            if (detected && detected.length > 0) {
              setResult(detected[0].rawValue);
            }
          }}
          onError={(error) => console.error(error)}
        />
      </div>
      <p>
        <strong>Scanned:</strong> {result}
      </p>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "20px auto",
            padding: 20,
            border: "1px solid #eee",
            maxWidth: 350,
            background: "#fafafa",
            borderRadius: 8,
          }}
        >
          <div>
            <label>
              Barcode: <b>{form.code}</b>
            </label>
          </div>
          <div>
            <label>
              Product Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="productName"
              value={form.productName}
              onChange={handleInputChange}
              className={formErrors.productName ? "red-border" : ""}
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <div>
            <label>
              MRP <span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="mrp"
              type="number"
              value={form.mrp}
              onChange={handleInputChange}
              className={formErrors.mrp ? "red-border" : ""}
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <div>
            <label>
              Discount <span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="discount"
              type="number"
              value={form.discount}
              onChange={handleInputChange}
              className={formErrors.discount ? "red-border" : ""}
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <div>
            <label>
              Weight <span style={{ color: "red" }}>*</span>
            </label>
            <input
              name="weight"
              value={form.weight}
              onChange={handleInputChange}
              className={formErrors.weight ? "red-border" : ""}
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <button type="submit" style={{ marginTop: 10 }}>
            Add Product
          </button>
        </form>
      )}

      <h3>All Scanned Barcodes</h3>
      <ul>
        {barcodes.map((b) => (
          <li key={b.id || b._id || b.code}>
            {b.code}{" "}
            {b.productName && (
              <span>
                - {b.productName} (MRP: {b.mrp}, Discount: {b.discount}, Weight:{" "}
                {b.weight})
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Red border style */}
      <style>
        {`
          .red-border {
            border: 1px solid red !important;
          }
        `}
      </style>
    </div>
  );
}

export default BarcodeScanner;
