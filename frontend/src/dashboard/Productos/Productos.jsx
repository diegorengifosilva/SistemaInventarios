// src/dashboard/productos/Productos.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  DollarSign,
  Users,
  BriefcaseBusiness,
  FilePlus,
} from "lucide-react";

import KpiCard from "@/components/ui/KpiCard";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { motion, useScroll, useTransform } from "framer-motion";
import { obtenerProductos, crearProducto } from "@/services/productoService";
import ProductoDetalleModal from "./ProductoDetalleModal";
import NuevoProducto from "./NuevoProducto";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalData, setModalData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.25]);
  const blurValue = useTransform(scrollY, [0, 100], [4, 8]);

  // Cargar productos
  useEffect(() => {
    async function fetchProductos() {
      const data = await obtenerProductos();
      setProductos(data || []);
    }
    fetchProductos();
  }, []);

  // ==== KPIs ====
  const totalProductos = productos.length;

  const productosActivos = productos.filter(
    (p) => p.stockActual > 0
  ).length;

  const productosBajoMinimo = productos.filter(
    (p) => p.stockActual <= (p.stockMinimo || 0)
  ).length;

  const stockValorizado = productos.reduce(
    (sum, p) => sum + p.stockActual * p.precioUnitario,
    0
  );

  const proveedoresActivos = new Set(
    productos
      .map((p) => p.proveedorId || p.proveedor?.id)
      .filter(Boolean)
  ).size;

  // Filtro simple
  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.codigo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col bg-gray-50 font-sans"
    >
      <div className="flex-1 flex flex-col py-[clamp(8px,2vw,24px)] px-[clamp(8px,2vw,24px)]">
        {/* HEADER */}
        <motion.div
          style={{
            boxShadow: shadowOpacity.get() > 0 ? `0 2px 8px rgba(0,0,0,${shadowOpacity.get()})` : "none",
            backdropFilter: `blur(${blurValue.get()}px)`,
          }}
          className="sticky top-0 z-30 bg-white/90 border-b border-gray-200 rounded-2xl shadow-md px-[clamp(12px,2vw,20px)] py-[clamp(8px,1.2vw,12px)] mb-[clamp(10px,2vw,16px)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[clamp(8px,1.5vw,12px)]"
        >
          <div className="flex-1 min-w-0">
            <motion.h1
              className="font-bold flex items-center gap-3 truncate"
              style={{ fontSize: "clamp(1rem,2.2vw,2rem)" }}
            >
              <BriefcaseBusiness className="w-[clamp(20px,3vw,30px)] h-[clamp(20px,3vw,30px)] text-gray-900" />
              Gestión de Productos
            </motion.h1>
            <motion.p
              className="mt-1 text-gray-600 italic truncate"
              style={{ fontSize: "clamp(0.7rem,0.9vw,1rem)" }}
            >
              Gestión de <span className="font-semibold text-blue-600">productos</span>.
            </motion.p>
          </div>

          {/* BOTÓN NUEVA COTIZACIÓN */}
          <div className="flex flex-wrap gap-2 justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setOpenModal("nueva")}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm"
              >
                <FilePlus className="w-4 h-4" /> Nuevo Producto
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 w-full">
          {[
            {
              title: "Total Productos",
              value: totalProductos,
              icon: Box,
              color: "#3b82f6",
            },
            {
              title: "Productos Activos",
              value: productosActivos,
              icon: TrendingUp,
              color: "#0ea5e9",
            },
            {
              title: "Bajo Stock Mínimo",
              value: productosBajoMinimo,
              icon: AlertTriangle,
              color: "#eab308",
            },
            {
              title: "Stock Valorizado (S/.)",
              value: parseFloat(stockValorizado).toFixed(2),
              icon: DollarSign,
              color: "#14b8a6",
            },
            {
              title: "Proveedores Activos",
              value: proveedoresActivos,
              icon: Users,
              color: "#7c3aed",
            },
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center text-white p-5 rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${kpi.color}cc, ${kpi.color}99)`,
              }}
            >
              {/* ICON */}
              <kpi.icon className="w-8 h-8 mb-2 opacity-90" />

              {/* LABEL */}
              <p className="text-sm font-medium">{kpi.title}</p>

              {/* VALUE */}
              <p className="text-2xl font-bold mt-1">
                {Number(kpi.value).toLocaleString()}
              </p>

              {/* PROGRESS BAR */}
              <div className="w-full h-2 bg-white bg-opacity-30 rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${
                      Math.min(
                        (Number(kpi.value) /
                          (totalProductos || productosActivos || 1)) * 100,
                        100
                      )
                    }%`,
                    backgroundColor: kpi.color,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* FILTROS */}
        <div className="w-full mb-4">
          
          {/* Buscador */}
          <div className="flex items-center w-full md:w-1/3 border rounded-xl px-3 py-2 bg-gray-50">
            <Search className="text-gray-500 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              className="bg-transparent outline-none px-2 w-full"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-2 border px-3 py-2 rounded-xl hover:bg-gray-100">
            <Filter className="w-4" /> Filtros Avanzados (Próx.)
          </button>
        </div>

        {/* TABLA */}
        <div className="hidden md:block w-full flex-1 overflow-auto">
          <Table
            headers={["Código", "Nombre", "Stock", "Precio", "Categoría", "Acciones"]}
            data={filtrados}
            renderRow={(p) => [
              p.codigo,
              p.nombre,
              p.stockActual,
              `S/ ${p.precioUnitario.toFixed(2)}`,
              p.categoria || "—",

              <div className="flex gap-2 justify-center">
                <button
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                  onClick={() => setModalData(p)}
                >
                  <Eye className="w-4 text-blue-700" />
                </button>
              </div>,
            ]}
          />
        </div>

        {/* MODAL DETALLES */}
        {modalData && (
          <ProductoDetalleModal
            producto={modalData}
            onClose={() => setModalData(null)}
          />
        )}

        <NuevoProducto
          open={openModal}
          onClick={() => setOpenModal(true)}
          onClose={() => setOpenModal(false)}
          onSave={async (producto) => {
            const ok = await crearProducto(producto);

            if (ok) {
              toast.success("Producto creado correctamente");

              // Recargar lista
              const data = await obtenerProductos();
              setProductos(data || []);
            } else {
              toast.error("No se pudo crear el producto");
            }
          }}
        />
      </div>
    </motion.div>
  );
}
