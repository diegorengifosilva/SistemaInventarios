import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Info,
  Package,
  Boxes,
  FileSearch,
  User,
} from "lucide-react";

export default function ProductoDetalleModal({ producto, onClose }) {
  const [tab, setTab] = useState("general");

  if (!producto) return null;

  const tabs = [
    { id: "general", label: "Info General", icon: Info },
    { id: "proveedor", label: "Proveedor", icon: User },
    { id: "stock", label: "Stock y Movimientos", icon: Boxes },
    { id: "auditoria", label: "Auditoría", icon: FileSearch },
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
            <h2 className="text-2xl font-bold">
              Detalles del Producto
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <X />
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Código: <strong>{producto.codigo}</strong> —{" "}
            <span className="font-semibold">{producto.nombre}</span>
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

                <p><strong>Nombre:</strong> {producto.nombre}</p>
                <p><strong>Precio:</strong> S/ {producto.precioUnitario}</p>
                <p><strong>Stock Actual:</strong> {producto.stockActual}</p>
                <p><strong>Stock Mínimo:</strong> {producto.stockMinimo ?? "—"}</p>
                <p><strong>Tipo:</strong> {producto.tipoProducto}</p>
                {producto.fechaVencimiento && (
                  <p><strong>Vencimiento:</strong> {producto.fechaVencimiento}</p>
                )}
              </div>
            )}

            {tab === "proveedor" && (
              <div>
                <h3 className="font-bold text-lg mb-2">Proveedor</h3>

                {producto.proveedor ? (
                  <div className="space-y-1">
                    <p><strong>RUC:</strong> {producto.proveedor.ruc}</p>
                    <p><strong>Razón Social:</strong> {producto.proveedor.razonSocial}</p>
                    <p><strong>Contacto:</strong> {producto.proveedor.contacto}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Sin proveedor asociado.</p>
                )}
              </div>
            )}

            {tab === "stock" && (
              <div>
                <h3 className="font-bold text-lg mb-2">Stock y Movimientos</h3>
                <p>📌 Aquí agregaremos un historial de movimientos de stock (entradas, salidas, ajustes).</p>
              </div>
            )}

            {tab === "auditoria" && (
              <div>
                <h3 className="font-bold text-lg mb-2">Auditoría</h3>
                <p>📌 Campo reservado para tracking de cambios, usuario que creó el producto, fechas, etc.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
