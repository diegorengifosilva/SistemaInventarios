// src/dashboard/movimientos/Movimientos.jsx
import React from "react";
import { motion } from "framer-motion";
import Table from "@/components/ui/table";

export default function Movimientos() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Movimientos de Inventario</h1>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-lg shadow p-4">
        <Table
          columns={["Fecha", "Producto", "Tipo", "Cantidad", "Usuario"]}
          data={[
            { date: "2025-12-08", product: "Producto 1", type: "Entrada", quantity: 20, user: "Admin" },
            { date: "2025-12-08", product: "Producto 2", type: "Salida", quantity: 5, user: "Admin" },
          ]}
        />
      </div>
    </div>
  );
}
