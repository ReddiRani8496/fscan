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
import React, { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
// If you need to support browsers without <dialog>:
import dialogPolyfill from "dialog-polyfill";
import "dialog-polyfill/dist/dialog-polyfill.css";

export default function BarcodeScanner() {
  // scanned raw code
  const [scannedCode, setScannedCode] = useState("");
  // all existing barcodes from your API
  const [barcodes, setBarcodes] = useState([]);
  // modal visibility
  const [showModal, setShowModal] = useState(false);

  // form fields
  const [productName, setProductName] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [weight, setWeight] = useState("");

  // ref to our <dialog>
  const dialogRef = useRef(null);

  // fetch existing barcodes on mount
  useEffect(() => {
    fetchBarcodes();
  }, []);

  function fetchBarcodes() {
    fetch("https://scan-production-500c.up.railway.app/api/barcodes")
      .then((res) => res.json())
      .then((data) => setBarcodes(data))
      .catch((err) => console.error("Fetch error:", err));
  }

  // register dialog-polyfill if needed
  useEffect(() => {
    if (
      dialogRef.current &&
      typeof dialogRef.current.showModal !== "function"
    ) {
      dialogPolyfill.registerDialog(dialogRef.current);
    }
  }, []);

  // when scannedCode changes, decide whether to pop open the dialog
  useEffect(() => {
    if (!scannedCode) return;
    const exists = barcodes.some((b) => b.code === scannedCode);
    if (exists) {
      // code already in DB → reset scanner
      setScannedCode("");
    } else {
      setShowModal(true);
    }
  }, [scannedCode, barcodes]);

  // open/close the native dialog
  useEffect(() => {
    if (showModal) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showModal]);

  function handleScan(detected) {
    if (detected && detected.length > 0) {
      setScannedCode(detected[0].rawValue);
    }
  }

  function closeModal() {
    setShowModal(false);
    setScannedCode("");
    setProductName("");
    setMrp("");
    setDiscount("");
    setWeight("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      code: scannedCode,
      productName,
      mrp: parseFloat(mrp),
      discount: parseFloat(discount),
      weight,
    };

    fetch("https://scan-production-500c.up.railway.app/api/barcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBarcodes();
        closeModal();
      })
      .catch((err) => console.error("Save error:", err));
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Barcode Scanner</h2>

      <div className="w-64 h-64 mx-auto border rounded-md overflow-hidden">
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
          onScan={handleScan}
          onError={console.error}
        />
      </div>

      <p className="text-center">
        <span className="font-semibold">Last scanned:</span>{" "}
        {scannedCode || "–"}
      </p>

      <h3 className="text-xl font-semibold">All Products</h3>
      <ul className="space-y-2">
        {barcodes.map((b) => (
          <li
            key={b.id || b._id || b.code}
            className="p-2 border rounded-md flex justify-between"
          >
            <span className="font-mono">{b.code}</span>
            <span>{b.productName || <em>(no name)</em>}</span>
          </li>
        ))}
      </ul>

      {/* --- The Dialog --- */}
      <dialog
        ref={dialogRef}
        className="
          fixed top-0 left-1/2 transform -translate-x-1/2 mt-20
          w-full max-w-md rounded-lg bg-white shadow-2xl
          border-0 p-0 overflow-hidden
        "
        onCancel={(e) => {
          e.preventDefault();
          closeModal();
        }}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeModal}
        />

        {/* Dialog Panel */}
        <form
          onSubmit={handleSubmit}
          className="relative z-50 flex flex-col h-full"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Add Product</h2>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Barcode (read-only) */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Barcode
              </label>
              <input
                type="text"
                readOnly
                value={scannedCode}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 500 g"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* MRP */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                MRP <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Discount (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="flex justify-end space-x-3 px-6 py-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}
