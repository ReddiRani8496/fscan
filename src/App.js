import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner";

function App() {
  const [data, setData] = useState("Not Found");

  return (
    <div>
      <BarcodeScanner />
    </div>
  );
}

export default App;
