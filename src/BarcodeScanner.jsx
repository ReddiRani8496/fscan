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

  // load existing barcodes on mount
  useEffect(() => {
    fetchBarcodes();
  }, []);

  function fetchBarcodes() {
    fetch("https://scan-production-500c.up.railway.app/api/barcodes")
      .then((res) => res.json())
      .then((data) => setBarcodes(data))
      .catch((err) => console.error("Fetch error:", err));
  }

  // whenever we get a new scan, decide to show modal or not
  useEffect(() => {
    if (!scannedCode) return;
    const exists = barcodes.some((b) => b.code === scannedCode);
    if (exists) {
      // already in DB → just clear
      setScannedCode("");
    } else {
      // new code → open modal
      setShowModal(true);
    }
  }, [scannedCode, barcodes]);

  function handleScan(detected) {
    if (detected && detected.length > 0) {
      setScannedCode(detected[0].rawValue);
    }
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

  function closeModal() {
    // reset form + hide
    setScannedCode("");
    setProductName("");
    setMrp("");
    setDiscount("");
    setWeight("");
    setShowModal(false);
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

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add Product
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Barcode */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <input
                  type="text"
                  readOnly
                  value={scannedCode}
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
