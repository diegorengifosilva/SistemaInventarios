// src/dashboard/principal/InventarioHome.jsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Table from "@/components/ui/table";
import KpiCard from "@/components/ui/KpiCard";

import { 
  Boxes, 
  AlertTriangle, 
  Ban, 
  TrendingUp 
} from "lucide-react";

export default function InventarioHome() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockCritico: 0,
    productosAgotados: 0,
    valorInventario: 0,
  });

  const [productosRecientes, setProductosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 60], [0, 0.25]);
  const blurValue = useTransform(scrollY, [0, 120], [4, 10]);

  useEffect(() => {
    setStats({
      totalProductos: 120,
      stockCritico: 8,
      productosAgotados: 3,
      valorInventario: 45230.5,
    });

    setProductosRecientes([
      { id: 1, nombre: "Producto A", categoria: "Cat 1", stock: 20 },
      { id: 2, nombre: "Producto B", categoria: "Cat 2", stock: 5 },
      { id: 3, nombre: "Producto C", categoria: "Cat 1", stock: 0 },
      { id: 4, nombre: "Producto D", categoria: "Cat 3", stock: 12 },
    ]);

    setLoading(false);
  }, []);

  const kpis = [
    {
      label: "Total Productos",
      value: stats.totalProductos,
      icon: Boxes,
      gradient: "linear-gradient(135deg,#3b82f6cc,#60a5fa99)",
    },
    {
      label: "Stock Crítico",
      value: stats.stockCritico,
      icon: AlertTriangle,
      gradient: "linear-gradient(135deg,#f59e0bcc,#fbbf2499)",
    },
    {
      label: "Agotados",
      value: stats.productosAgotados,
      icon: Ban,
      gradient: "linear-gradient(135deg,#ef4444cc,#f8717199)",
    },
    {
      label: "Valor Inventario S/.",
      value: stats.valorInventario.toFixed(2),
      icon: TrendingUp,
      gradient: "linear-gradient(135deg,#16a34acc,#4ade8099)",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full flex flex-col bg-gray-50"
    >
      <div className="flex-1 flex flex-col px-[clamp(8px,2vw,24px)] py-[clamp(10px,3vw,28px)]">

        {/* HEADER */}
        <motion.div
          style={{
            boxShadow: shadowOpacity.get() > 0 
              ? `0 2px 8px rgba(0,0,0,${shadowOpacity.get()})`
              : "none",
            backdropFilter: `blur(${blurValue.get()}px)`,
          }}
          className="sticky top-0 z-30 bg-white/80 border-b border-gray-200 rounded-2xl px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-[clamp(1.3rem,2.5vw,2.2rem)] flex items-center gap-3">
              📦 Inventario General
            </h1>
            <p className="text-gray-600 italic text-[clamp(0.8rem,1vw,1rem)]">
              Estado actual del inventario y movimientos recientes
            </p>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}>
              <KpiCard
                label={kpi.label}
                value={loading ? 0 : kpi.value}
                icon={kpi.icon}
                gradient={kpi.gradient}
              />
            </motion.div>
          ))}
        </div>

        {/* TABLAS */}
        <div className="grid grid-cols-1 gap-6">

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-700 mb-4 text-lg">
              Productos Recientes
            </h2>

            <Table
              headers={["ID", "Nombre", "Categoría", "Stock"]}
              data={productosRecientes}
              renderRow={(p) => [
                <span>{p.id}</span>,
                <span>{p.nombre}</span>,
                <span>{p.categoria}</span>,
                <span className={p.stock === 0 ? "text-red-600 font-semibold" : ""}>
                  {p.stock}
                </span>,
              ]}
              rowsPerPage={5}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 h-64 flex items-center justify-center text-gray-400 italic">
            Gráfico de movimientos — pendiente de implementación
          </div>

        </div>
      </div>
    </motion.div>
  );
}
