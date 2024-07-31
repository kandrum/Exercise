import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Components/Login";
import { Home } from "./Components/Home";
import { CartItems } from "./Components/Cart";
import ProtectedRoute from "./ProtectedRouter";
import { CartProvider } from "./Components/Contextapi"; // Import CartProvider

function App() {
  return (
    <CartProvider> {/* Wrap the Router with CartProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartItems /></ProtectedRoute>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
