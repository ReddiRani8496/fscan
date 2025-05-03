// import React, { useState, useEffect } from "react";
// import { Scanner } from "@yudiel/react-qr-scanner";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import InvoicePDF from "./InvoicePDF";
// import "./BarcodeScanner.css"; // Import your CSS file

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
//   const [pdfDownloaded, setPdfDownloaded] = useState(false);

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
//     setPdfDownloaded(false);
//   };

//   const getTotal = () =>
//     scannedProducts.reduce(
//       (sum, p) =>
//         sum + (Number(p.mrp) - Number(p.discount)) * Number(p.quantity),
//       0
//     );

//   return (
//     <div className="barcode-scanner-container">
//       <h2 style={{ textAlign: "center" }}>Barcode Scanner</h2>
//       <div className="scanner-box">
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
//         <form className="add-product-form" onSubmit={handleSubmit}>
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
//             />
//           </div>
//           <div className="form-buttons">
//             <button type="submit">Add Product</button>
//             <button type="button" onClick={handleCancel} className="cancel-btn">
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Bill Table */}
//       <h3 style={{ textAlign: "center" }}>Current Bill</h3>
//       {scannedProducts.length === 0 ? (
//         <p style={{ textAlign: "center" }}>No products scanned yet.</p>
//       ) : (
//         <div className="bill-table-container">
//           <table className="bill-table">
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
//                   <td>Rs. {p.mrp}</td>
//                   <td>Rs. {p.discount}</td>
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
//                   <b>Rs. {getTotal().toFixed(2)}</b>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//           <div className="bill-actions">
//             <PDFDownloadLink
//               document={
//                 <InvoicePDF products={scannedProducts} billDate={billDate} />
//               }
//               fileName={`xAbleKart_Invoice_${Date.now()}.pdf`}
//               className="bill-actions-link"
//             >
//               {({ loading }) =>
//                 loading ? (
//                   "Generating PDF..."
//                 ) : (
//                   <span
//                     onClick={() => setPdfDownloaded(true)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     Generate Bill (PDF)
//                   </span>
//                 )
//               }
//             </PDFDownloadLink>
//             <button onClick={clearBill} className="clear-btn">
//               Clear Bill (New Customer)
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Notification after PDF download */}
//       {pdfDownloaded && (
//         <div className="pdf-notification">
//           <span>
//             Invoice PDF downloaded!{" "}
//             <PDFDownloadLink
//               document={
//                 <InvoicePDF products={scannedProducts} billDate={billDate} />
//               }
//               fileName={`xAbleKart_Invoice_${Date.now()}.pdf`}
//               style={{
//                 color: "#1565c0",
//                 textDecoration: "underline",
//                 cursor: "pointer",
//               }}
//             >
//               {({ url }) => (
//                 <span
//                   onClick={() => setPdfDownloaded(false)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   Click here to open again
//                 </span>
//               )}
//             </PDFDownloadLink>
//           </span>
//           <span
//             className="close-btn"
//             onClick={() => setPdfDownloaded(false)}
//             title="Close"
//           >
//             ×
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default BarcodeScanner;
import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import "./BarcodeScanner.css";

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
  const [pdfUrl, setPdfUrl] = useState("");

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
    setPdfUrl("");
  };

  const getTotal = () =>
    scannedProducts.reduce(
      (sum, p) =>
        sum + (Number(p.mrp) - Number(p.discount)) * Number(p.quantity),
      0
    );

  // Share handlers
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Here is your xAbleKart invoice. Download: ${pdfUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Your xAbleKart Invoice");
    const body = encodeURIComponent(
      `Dear Customer,\n\nHere is your invoice from xAbleKart.\nDownload: ${pdfUrl}\n\nThank you!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pdfUrl);
    alert("PDF link copied to clipboard!");
  };

  return (
    <div className="barcode-scanner-container">
      <h2 style={{ textAlign: "center" }}>Barcode Scanner</h2>
      <div className="scanner-box">
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
        <form className="add-product-form" onSubmit={handleSubmit}>
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
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Add Product</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Bill Table */}
      <h3 style={{ textAlign: "center" }}>Current Bill</h3>
      {scannedProducts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No products scanned yet.</p>
      ) : (
        <div className="bill-table-container">
          <table className="bill-table">
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
          <div className="bill-actions">
            <PDFDownloadLink
              document={
                <InvoicePDF products={scannedProducts} billDate={billDate} />
              }
              fileName={`xAbleKart_Invoice_${Date.now()}.pdf`}
              className="bill-actions-link"
            >
              {({ loading, url }) =>
                loading ? (
                  "Generating PDF..."
                ) : (
                  <span
                    onClick={() => {
                      setPdfDownloaded(true);
                      setPdfUrl(url);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Generate Bill (PDF)
                  </span>
                )
              }
            </PDFDownloadLink>
            <button onClick={clearBill} className="clear-btn">
              Clear Bill (New Customer)
            </button>
          </div>
        </div>
      )}

      {/* Share PDF Screen */}
      {pdfDownloaded && pdfUrl && (
        <div className="pdf-share-screen">
          <h3>Share your Invoice</h3>
          <div className="share-buttons">
            <button className="whatsapp-btn" onClick={handleShareWhatsApp}>
              <img
                src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
                alt="WhatsApp"
                width={28}
                height={28}
              />
              Share via WhatsApp
            </button>
            <button className="email-btn" onClick={handleShareEmail}>
              <img
                src="https://img.icons8.com/color/48/000000/gmail-new.png"
                alt="Email"
                width={28}
                height={28}
              />
              Share via Email
            </button>
            <button className="copy-btn" onClick={handleCopyLink}>
              <img
                src="https://img.icons8.com/material-rounded/48/000000/copy.png"
                alt="Copy"
                width={28}
                height={28}
              />
              Copy PDF Link
            </button>
          </div>
          <button
            className="close-btn"
            onClick={() => setPdfDownloaded(false)}
            style={{ marginTop: 16 }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
