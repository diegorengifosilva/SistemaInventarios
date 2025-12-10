// src/dashboard/Proveedor/ProveedorDetalleModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Package, Boxes } from "lucide-react";

export default function ProveedorDetalleModal({ proveedor, onClose }) {
  const [tab, setTab] = useState("general");

  if (!proveedor) return null;

  const tabs = [
    { id: "general", label: "Info General", icon: Info },
    { id: "productos", label: "Productos", icon: Package },
    { id: "historial", label: "Historial", icon: Boxes },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* CONTENEDOR DEL MODAL */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Detalles del Proveedor</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
              <X />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            RUC: <strong>{proveedor.ruc}</strong> —{" "}
            <span className="font-semibold">{proveedor.razonSocial}</span>
          </p>

          {/* TABS */}
          <div className="flex gap-2 mb-4 border-b pb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                  tab === t.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <t.icon className="w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* CONTENIDO DE LAS PESTAÑAS */}
          <div className="mt-4 min-h-[200px]">
            {tab === "general" && (
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Información General</h3>
                <p><strong>Razón Social:</strong> {proveedor.razonSocial}</p>
                <p><strong>RUC:</strong> {proveedor.ruc}</p>
                <p><strong>Contacto:</strong> {proveedor.contacto ?? "-"}</p>
                <p><strong>Email:</strong> {proveedor.email ?? "-"}</p>
                {proveedor.logoUrl && (
                  <img
                    src={proveedor.logoUrl}
                    alt={`${proveedor.razonSocial} Logo`}
                    className="w-32 h-32 object-contain mt-2 rounded-lg border"
                  />
                )}
              </div>
            )}

            {tab === "productos" && (
              <div>
                <h3 className="font-bold text-lg mb-2">Productos Relacionados</h3>
                {proveedor.productos && proveedor.productos.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 max-h-48 overflow-auto">
                    {proveedor.productos.map((p) => (
                      <li key={p.codigo}>
                        {p.nombre} — Stock: {p.stockActual} — S/ {p.precioUnitario.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No tiene productos asociados.</p>
                )}
              </div>
            )}

            {tab === "historial" && (
              <div>
                <h3 className="font-bold text-lg mb-2">Historial</h3>
                <p className="text-gray-500">📌 Aquí podrías mostrar compras, transacciones o interacciones con el proveedor.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
