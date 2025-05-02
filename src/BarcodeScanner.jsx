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

// import React, { useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";

// function BarcodeScanner() {
//   const [result, setResult] = useState("");
//   const [barcodes, setBarcodes] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     code: "",
//     productName: "",
//     mrp: "",
//     discount: "",
//     weight: "",
//   });
//   const [formErrors, setFormErrors] = useState({});

//   // Fetch all barcodes on mount
//   useEffect(() => {
//     fetchBarcodes();
//   }, []);

//   // Handle new scan
//   useEffect(() => {
//     if (result) {
//       const exists = barcodes.some((b) => b.code === result);
//       if (exists) {
//         setShowForm(false);
//         setForm({
//           code: "",
//           productName: "",
//           mrp: "",
//           discount: "",
//           weight: "",
//         });
//         alert("Barcode already exists. No need to add product.");
//       } else {
//         setForm({
//           code: result,
//           productName: "",
//           mrp: "",
//           discount: "",
//           weight: "",
//         });
//         setShowForm(true);
//       }
//     }
//     // eslint-disable-next-line
//   }, [result, barcodes]);

//   const fetchBarcodes = () => {
//     fetch("https://scan-production-500c.up.railway.app/api/barcodes")
//       .then((res) => res.json())
//       .then((data) => setBarcodes(data))
//       .catch((err) => console.error("Error fetching barcodes:", err));
//   };

//   const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!form.productName) errors.productName = true;
//     if (!form.mrp) errors.mrp = true;
//     if (!form.discount) errors.discount = true;
//     if (!form.weight) errors.weight = true;
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     fetch("https://scan-production-500c.up.railway.app/api/barcodes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())
//       .then(() => {
//         fetchBarcodes();
//         setShowForm(false);
//         setForm({
//           code: "",
//           productName: "",
//           mrp: "",
//           discount: "",
//           weight: "",
//         });
//         setResult(""); // Reset scanner result
//       })
//       .catch((err) => console.error("Error saving product:", err));
//   };

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
//             if (detected && detected.length > 0) {
//               setResult(detected[0].rawValue);
//             }
//           }}
//           onError={(error) => console.error(error)}
//         />
//       </div>
//       <p>
//         <strong>Scanned:</strong> {result}
//       </p>

//       {/* Product Form */}
//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           style={{
//             margin: "20px auto",
//             padding: 20,
//             border: "1px solid #eee",
//             maxWidth: 350,
//             background: "#fafafa",
//             borderRadius: 8,
//           }}
//         >
//           <div>
//             <label>
//               Barcode: <b>{form.code}</b>
//             </label>
//           </div>
//           <div>
//             <label>
//               Product Name <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="productName"
//               value={form.productName}
//               onChange={handleInputChange}
//               className={formErrors.productName ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div>
//             <label>
//               MRP <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="mrp"
//               type="number"
//               value={form.mrp}
//               onChange={handleInputChange}
//               className={formErrors.mrp ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div>
//             <label>
//               Discount <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="discount"
//               type="number"
//               value={form.discount}
//               onChange={handleInputChange}
//               className={formErrors.discount ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div>
//             <label>
//               Weight <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="weight"
//               value={form.weight}
//               onChange={handleInputChange}
//               className={formErrors.weight ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <button type="submit" style={{ marginTop: 10 }}>
//             Add Product
//           </button>
//         </form>
//       )}

//       <h3>All Scanned Barcodes</h3>
//       <ul>
//         {barcodes.map((b) => (
//           <li key={b.id || b._id || b.code}>
//             {b.code}{" "}
//             {b.productName && (
//               <span>
//                 - {b.productName} (MRP: {b.mrp}, Discount: {b.discount}, Weight:{" "}
//                 {b.weight})
//               </span>
//             )}
//           </li>
//         ))}
//       </ul>

//       {/* Red border style */}
//       <style>
//         {`
//           .red-border {
//             border: 1px solid red !important;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default BarcodeScanner;
// import React, { useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import InvoicePDF from "./InvoicePDF"; // Adjust path if needed

// function BarcodeScanner() {
//   const [barcodes, setBarcodes] = useState([]);
//   const [scannedProducts, setScannedProducts] = useState([]);
//   const [result, setResult] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     code: "",
//     productName: "",
//     mrp: "",
//     discount: "",
//     weight: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [billDate, setBillDate] = useState(new Date().toLocaleString());

//   useEffect(() => {
//     fetchBarcodes();
//   }, []);

//   const fetchBarcodes = () => {
//     fetch("https://scan-production-500c.up.railway.app/api/barcodes")
//       .then((res) => res.json())
//       .then((data) => setBarcodes(data))
//       .catch((err) => console.error("Error fetching barcodes:", err));
//   };

//   useEffect(() => {
//     if (result) {
//       const product = barcodes.find((b) => b.code === result);
//       if (product) {
//         setScannedProducts((prev) => {
//           const existing = prev.find((p) => p.code === product.code);
//           if (existing) {
//             return prev.map((p) =>
//               p.code === product.code ? { ...p, quantity: p.quantity + 1 } : p
//             );
//           } else {
//             return [...prev, { ...product, quantity: 1 }];
//           }
//         });
//         setShowForm(false);
//         setForm({
//           code: "",
//           productName: "",
//           mrp: "",
//           discount: "",
//           weight: "",
//         });
//       } else {
//         setForm({
//           code: result,
//           productName: "",
//           mrp: "",
//           discount: "",
//           weight: "",
//         });
//         setShowForm(true);
//       }
//       setResult("");
//     }
//     // eslint-disable-next-line
//   }, [result, barcodes]);

//   const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!form.productName) errors.productName = true;
//     if (!form.mrp) errors.mrp = true;
//     if (!form.discount) errors.discount = true;
//     if (!form.weight) errors.weight = true;
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     fetch("https://scan-production-500c.up.railway.app/api/barcodes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     })
//       .then((res) => res.json())
//       .then(() => {
//         fetchBarcodes();
//         setShowForm(false);
//         setForm({
//           code: "",
//           productName: "",
//           mrp: "",
//           discount: "",
//           weight: "",
//         });
//         setScannedProducts((prev) => [...prev, { ...form, quantity: 1 }]);
//       })
//       .catch((err) => console.error("Error saving product:", err));
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setForm({
//       code: "",
//       productName: "",
//       mrp: "",
//       discount: "",
//       weight: "",
//     });
//   };

//   const increment = (code) => {
//     setScannedProducts((prev) =>
//       prev.map((p) =>
//         p.code === code ? { ...p, quantity: p.quantity + 1 } : p
//       )
//     );
//   };
//   const decrement = (code) => {
//     setScannedProducts((prev) =>
//       prev
//         .map((p) =>
//           p.code === code ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
//         )
//         .filter((p) => p.quantity > 0)
//     );
//   };
//   const removeProduct = (code) => {
//     setScannedProducts((prev) => prev.filter((p) => p.code !== code));
//   };
//   const clearBill = () => {
//     setScannedProducts([]);
//     setBillDate(new Date().toLocaleString());
//   };

//   const getTotal = () =>
//     scannedProducts.reduce(
//       (sum, p) =>
//         sum + (Number(p.mrp) - Number(p.discount)) * Number(p.quantity),
//       0
//     );

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
//             if (detected && detected.length > 0) {
//               setResult(detected[0].rawValue);
//             }
//           }}
//           onError={(error) => console.error(error)}
//         />
//       </div>

//       {/* Add Product Form */}
//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           style={{
//             margin: "20px auto",
//             padding: 20,
//             border: "1px solid #eee",
//             maxWidth: 350,
//             background: "#fafafa",
//             borderRadius: 8,
//           }}
//         >
//           <div>
//             <label>
//               Barcode: <b>{form.code}</b>
//             </label>
//           </div>
//           <div>
//             <label>
//               Product Name <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="productName"
//               value={form.productName}
//               onChange={handleInputChange}
//               className={formErrors.productName ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div>
//             <label>
//               MRP <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="mrp"
//               type="number"
//               value={form.mrp}
//               onChange={handleInputChange}
//               className={formErrors.mrp ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div>
//             <label>
//               Discount <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="discount"
//               type="number"
//               value={form.discount}
//               onChange={handleInputChange}
//               className={formErrors.discount ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div>
//             <label>
//               Weight <span style={{ color: "red" }}>*</span>
//             </label>
//             <input
//               name="weight"
//               value={form.weight}
//               onChange={handleInputChange}
//               className={formErrors.weight ? "red-border" : ""}
//               style={{ width: "100%", marginBottom: 8 }}
//             />
//           </div>
//           <div style={{ marginTop: 10 }}>
//             <button type="submit">Add Product</button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               style={{
//                 marginLeft: 10,
//                 background: "#f33",
//                 color: "#fff",
//                 border: "none",
//                 padding: "6px 12px",
//                 borderRadius: 4,
//                 cursor: "pointer",
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Bill Table */}
//       <h3>Current Bill</h3>
//       {scannedProducts.length === 0 ? (
//         <p>No products scanned yet.</p>
//       ) : (
//         <div style={{ overflowX: "auto" }}>
//           <table
//             border={1}
//             cellPadding={6}
//             style={{ margin: "auto", minWidth: 600 }}
//           >
//             <thead>
//               <tr>
//                 <th>Product Name</th>
//                 <th>MRP</th>
//                 <th>Discount</th>
//                 <th>Weight</th>
//                 <th>Quantity</th>
//                 <th>Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {scannedProducts.map((p) => (
//                 <tr key={p.code}>
//                   <td>{p.productName}</td>
//                   <td>{p.mrp}</td>
//                   <td>{p.discount}</td>
//                   <td>{p.weight}</td>
//                   <td>
//                     <button onClick={() => decrement(p.code)}>-</button>
//                     <span style={{ margin: "0 8px" }}>{p.quantity}</span>
//                     <button onClick={() => increment(p.code)}>+</button>
//                   </td>
//                   <td>
//                     <button onClick={() => removeProduct(p.code)}>
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={4} style={{ textAlign: "right" }}>
//                   <b>Total</b>
//                 </td>
//                 <td colSpan={2}>
//                   <b>₹{getTotal().toFixed(2)}</b>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//           <div style={{ marginTop: 20, textAlign: "center" }}>
//             <PDFDownloadLink
//               document={
//                 <InvoicePDF products={scannedProducts} billDate={billDate} />
//               }
//               fileName={`xAbleKart_Invoice_${Date.now()}.pdf`}
//               style={{
//                 background: "#1a73e8",
//                 color: "#fff",
//                 padding: "10px 24px",
//                 borderRadius: 6,
//                 textDecoration: "none",
//                 fontWeight: 700,
//                 fontSize: 16,
//                 marginRight: 16,
//               }}
//             >
//               {({ loading }) =>
//                 loading ? "Generating PDF..." : "Generate Bill (PDF)"
//               }
//             </PDFDownloadLink>
//             <button
//               onClick={clearBill}
//               style={{
//                 background: "#f33",
//                 color: "#fff",
//                 padding: "10px 24px",
//                 borderRadius: 6,
//                 fontWeight: 700,
//                 fontSize: 16,
//               }}
//             >
//               Clear Bill
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Red border style */}
//       <style>
//         {`
//           .red-border {
//             border: 1px solid red !important;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default BarcodeScanner;
import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF"; // Adjust path if needed

function BarcodeScanner() {
  const [barcodes, setBarcodes] = useState([]);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [result, setResult] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    productName: "",
    mrp: "",
    discount: "",
    weight: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [billDate, setBillDate] = useState(new Date().toLocaleString());
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  useEffect(() => {
    fetchBarcodes();
  }, []);

  const fetchBarcodes = () => {
    fetch("https://scan-production-500c.up.railway.app/api/barcodes")
      .then((res) => res.json())
      .then((data) => setBarcodes(data))
      .catch((err) => console.error("Error fetching barcodes:", err));
  };

  useEffect(() => {
    if (result) {
      const product = barcodes.find((b) => b.code === result);
      if (product) {
        setScannedProducts((prev) => {
          const existing = prev.find((p) => p.code === product.code);
          if (existing) {
            return prev.map((p) =>
              p.code === product.code ? { ...p, quantity: p.quantity + 1 } : p
            );
          } else {
            return [...prev, { ...product, quantity: 1 }];
          }
        });
        setShowForm(false);
        setForm({
          code: "",
          productName: "",
          mrp: "",
          discount: "",
          weight: "",
        });
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
      setResult("");
    }
    // eslint-disable-next-line
  }, [result, barcodes]);

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
        setScannedProducts((prev) => [...prev, { ...form, quantity: 1 }]);
      })
      .catch((err) => console.error("Error saving product:", err));
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({
      code: "",
      productName: "",
      mrp: "",
      discount: "",
      weight: "",
    });
  };

  const increment = (code) => {
    setScannedProducts((prev) =>
      prev.map((p) =>
        p.code === code ? { ...p, quantity: p.quantity + 1 } : p
      )
    );
  };
  const decrement = (code) => {
    setScannedProducts((prev) =>
      prev
        .map((p) =>
          p.code === code ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };
  const removeProduct = (code) => {
    setScannedProducts((prev) => prev.filter((p) => p.code !== code));
  };
  const clearBill = () => {
    setScannedProducts([]);
    setBillDate(new Date().toLocaleString());
    setPdfDownloaded(false);
  };

  const getTotal = () =>
    scannedProducts.reduce(
      (sum, p) =>
        sum + (Number(p.mrp) - Number(p.discount)) * Number(p.quantity),
      0
    );

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

      {/* Add Product Form */}
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
          <div style={{ marginTop: 10 }}>
            <button type="submit">Add Product</button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                marginLeft: 10,
                background: "#f33",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Bill Table */}
      <h3>Current Bill</h3>
      {scannedProducts.length === 0 ? (
        <p>No products scanned yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border={1}
            cellPadding={6}
            style={{ margin: "auto", minWidth: 600 }}
          >
            <thead>
              <tr>
                <th>Product Name</th>
                <th>MRP</th>
                <th>Discount</th>
                <th>Weight</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {scannedProducts.map((p) => (
                <tr key={p.code}>
                  <td>{p.productName}</td>
                  <td>Rs. {p.mrp}</td>
                  <td>Rs. {p.discount}</td>
                  <td>{p.weight}</td>
                  <td>
                    <button onClick={() => decrement(p.code)}>-</button>
                    <span style={{ margin: "0 8px" }}>{p.quantity}</span>
                    <button onClick={() => increment(p.code)}>+</button>
                  </td>
                  <td>
                    <button onClick={() => removeProduct(p.code)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ textAlign: "right" }}>
                  <b>Total</b>
                </td>
                <td colSpan={2}>
                  <b>Rs. {getTotal().toFixed(2)}</b>
                </td>
              </tr>
            </tfoot>
          </table>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <PDFDownloadLink
              document={
                <InvoicePDF products={scannedProducts} billDate={billDate} />
              }
              fileName={`xAbleKart_Invoice_${Date.now()}.pdf`}
              style={{
                background: "#1a73e8",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 16,
                marginRight: 16,
              }}
            >
              {({ loading }) =>
                loading ? (
                  "Generating PDF..."
                ) : (
                  <span
                    onClick={() => setPdfDownloaded(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Generate Bill (PDF)
                  </span>
                )
              }
            </PDFDownloadLink>
            <button
              onClick={clearBill}
              style={{
                background: "#f33",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Clear Bill (New Customer)
            </button>
          </div>
        </div>
      )}

      {/* Notification after PDF download */}
      {pdfDownloaded && (
        <div
          style={{
            margin: "20px auto",
            padding: "16px 24px",
            maxWidth: 400,
            background: "#e3f0fb",
            color: "#1a73e8",
            borderRadius: 8,
            fontWeight: 500,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <span>
            Invoice PDF downloaded!{" "}
            <PDFDownloadLink
              document={
                <InvoicePDF products={scannedProducts} billDate={billDate} />
              }
              fileName={`xAbleKart_Invoice_${Date.now()}.pdf`}
              style={{
                color: "#1565c0",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {({ url }) => (
                <span
                  onClick={() => setPdfDownloaded(false)}
                  style={{ cursor: "pointer" }}
                >
                  Click here to open again
                </span>
              )}
            </PDFDownloadLink>
          </span>
          <span
            style={{
              marginLeft: 16,
              color: "#888",
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
            }}
            onClick={() => setPdfDownloaded(false)}
            title="Close"
          >
            ×
          </span>
        </div>
      )}

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
