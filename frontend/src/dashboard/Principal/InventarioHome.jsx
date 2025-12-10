// src/dashboard/principal/InventarioHome.jsx
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Table from "@/components/ui/table";
import { toast } from "react-toastify";
import { Boxes, AlertTriangle, TrendingUp, Users } from "lucide-react";

import { obtenerProductos } from "@/services/productoService";
import { obtenerProveedores } from "@/services/proveedorService";
import { obtenerTransacciones } from "@/services/transaccionService";

export default function InventarioHome() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.25]);
  const blurValue = useTransform(scrollY, [0, 100], [4, 8]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, provs, trans] = await Promise.all([
          obtenerProductos(),
          obtenerProveedores(),
          obtenerTransacciones(),
        ]);
        setProductos(prods || []);
        setProveedores(provs || []);
        setTransacciones(trans || []);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando datos del inventario");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const kpis = [
    { title: "Total Productos", value: productos.length, icon: Boxes, color: "#3b82f6" },
    { title: "Stock Crítico (<10)", value: productos.filter(p => p.stockActual < 10).length, icon: AlertTriangle, color: "#f59e0b" },
    { title: "Total Proveedores", value: proveedores.length, icon: Users, color: "#0ea5e9" },
    { title: "Total Transacciones", value: transacciones.length, icon: TrendingUp, color: "#16a34a" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen w-full bg-gray-50 font-sans"
    >
      {/* Contenedor scroll único */}
      <div className="flex-1 flex flex-col py-6 px-8 w-full overflow-auto">

        {/* HEADER */}
        <motion.div
          style={{
            boxShadow: shadowOpacity.get() > 0 ? `0 2px 8px rgba(0,0,0,${shadowOpacity.get()})` : "none",
            backdropFilter: `blur(${blurValue.get()}px)`,
          }}
          className="sticky top-0 z-30 bg-white/90 border-b border-gray-200 rounded-2xl shadow-md px-6 py-3 mb-6 flex flex-col gap-2"
        >
          <motion.h1 className="font-bold text-2xl flex items-center gap-2">📦 Dashboard Inventario</motion.h1>
          <motion.p className="text-gray-600 italic text-sm">
            Resumen de <span className="font-semibold text-blue-600">productos, proveedores y transacciones</span>.
          </motion.p>
        </motion.div>

        {/* KPIs */}
        <div className="flex gap-4 mb-6 w-full">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="flex-1 flex flex-col items-center justify-center text-white p-4 rounded-xl shadow-sm"
              style={{ background: `linear-gradient(135deg, ${kpi.color}cc, ${kpi.color}99)` }}
            >
              <kpi.icon className="w-6 h-6 mb-1 opacity-90" />
              <p className="text-sm font-medium">{kpi.title}</p>
              <p className="text-xl font-bold mt-1">{Number(kpi.value).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* TABLAS */}
        <div className="flex flex-col gap-6 w-full">

          {/* Productos */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 w-full" style={{ minHeight: "clamp(150px, 25vh, 300px)" }}>
            <h2 className="font-semibold text-gray-700 mb-2 text-lg">Productos Recientes</h2>
            <Table
              headers={["Código", "Nombre", "Stock", "Proveedor"]}
              data={productos.slice(-5)}
              renderRow={(p) => [
                p.codigo,
                p.nombre,
                <span className={p.stockActual < 10 ? "text-red-600 font-semibold" : ""}>{p.stockActual}</span>,
                p.rucProveedor,
              ]}
              rowsPerPage={5}
            />
          </div>

          {/* Proveedores */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 w-full" style={{ minHeight: "clamp(150px, 25vh, 300px)" }}>
            <h2 className="font-semibold text-gray-700 mb-2 text-lg">Proveedores Recientes</h2>
            <Table
              headers={["RUC", "Razón Social", "Contacto"]}
              data={proveedores.slice(-5)}
              renderRow={(p) => [p.ruc, p.razonSocial, p.contacto || "-"]}
              rowsPerPage={5}
            />
          </div>

          {/* Transacciones */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 w-full" style={{ minHeight: "clamp(150px, 25vh, 300px)" }}>
            <h2 className="font-semibold text-gray-700 mb-2 text-lg">Últimas Transacciones</h2>
            <Table
              headers={["ID", "Tipo", "Producto", "Cantidad", "Fecha"]}
              data={transacciones.slice(-5)}
              renderRow={(t) => [
                t.idTransaccion,
                t.tipo,
                t.producto?.nombre || "-",
                t.cantidad,
                new Date(t.fecha).toLocaleString(),
              ]}
              rowsPerPage={5}
            />
          </div>

        </div>
      </div>
    </motion.div>
  );
}
