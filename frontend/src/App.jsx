// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "@/styles/Home.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

// LAYOUT PRINCIPAL
import DashboardLayout from "@/dashboard/Layout/DashboardLayout.jsx";

// DASHBOARDS
import InventarioHome from "@/dashboard/Principal/InventarioHome.jsx";
import Movimientos from "@/dashboard/Movimientos/Movimientos.jsx";
import Productos from "@/dashboard/Productos/Productos.jsx";
import Proveedor from "@/dashboard/Proveedor/Proveedor.jsx";
import TransaccionesDashboard from "@/dashboard/Transacciones/TransaccionesDashboard.jsx";

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Dashboard principal */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          {/* Dashboard principal */}
          <Route index element={<InventarioHome />} />

          {/* Productos */}
          <Route path="productos" element={<Productos />} />

          {/* Proveedor */}
          <Route path="proveedores" element={<Proveedor />} />

          {/* Transacciones */}
          <Route path="transacciones" element={<TransaccionesDashboard />} />
        </Route>

        {/* Redirecciones globales */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
