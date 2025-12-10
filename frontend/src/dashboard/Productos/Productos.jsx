// src/dashboard/productos/Productos.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TrendingUp,
  Search,
  Eye,
  AlertTriangle,
  DollarSign,
  Users,
  BriefcaseBusiness,
  FilePlus,
} from "lucide-react";

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
  const [filtroAvanzado, setFiltroAvanzado] = useState({
    codigo: "",
    nombre: "",
    stockMin: "",
    stockMax: "",
    categoria: "",
  });

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
  const productosActivos = productos.filter((p) => p.stockActual > 0).length;
  const productosBajoMinimo = productos.filter(
    (p) => p.stockActual <= (p.stockMinimo || 0)
  ).length;
  const stockValorizado = productos.reduce(
    (sum, p) => sum + p.stockActual * p.precioUnitario,
    0
  );
  const proveedoresActivos = new Set(
    productos.map((p) => p.proveedorId || p.proveedor?.id).filter(Boolean)
  ).size;

  // ==== Filtrado Inteligente ====
  const filtrados = productos.filter((p) => {
    const busqueda = filtro.toLowerCase();

    // Verifica búsqueda principal + filtros avanzados
    const cumpleBusqueda =
      (!busqueda || p.nombre.toLowerCase().includes(busqueda) || p.codigo.toLowerCase().includes(busqueda)) &&
      (!filtroAvanzado.codigo || p.codigo.toLowerCase().includes(filtroAvanzado.codigo.toLowerCase())) &&
      (!filtroAvanzado.nombre || p.nombre.toLowerCase().includes(filtroAvanzado.nombre.toLowerCase())) &&
      (!filtroAvanzado.stockMin || p.stockActual >= Number(filtroAvanzado.stockMin)) &&
      (!filtroAvanzado.stockMax || p.stockActual <= Number(filtroAvanzado.stockMax)) &&
      (!filtroAvanzado.categoria || p.categoria === filtroAvanzado.categoria);

    return cumpleBusqueda;
  });

  // Categorías únicas para el filtro
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col bg-gray-50 font-sans"
    >
      <div className="flex-1 flex flex-col py-6 px-6 overflow-auto">
        {/* HEADER */}
        <motion.div
          style={{
            boxShadow:
              shadowOpacity.get() > 0
                ? `0 2px 8px rgba(0,0,0,${shadowOpacity.get()})`
                : "none",
            backdropFilter: `blur(${blurValue.get()}px)`,
          }}
          className="sticky top-0 z-30 bg-white/90 border-b border-gray-200 rounded-2xl shadow-md px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <motion.h1 className="font-bold flex items-center gap-3 truncate text-xl sm:text-2xl">
              <BriefcaseBusiness className="w-6 h-6 text-gray-900" />
              Gestión de Productos
            </motion.h1>
            <motion.p className="mt-1 text-gray-600 italic truncate text-sm sm:text-base">
              Gestión de <span className="font-semibold text-blue-600">productos</span>.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end mt-2 sm:mt-0">
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

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 w-full">
          {[
            { title: "Total Productos", value: totalProductos, icon: Box, color: "#3b82f6" },
            { title: "Productos Activos", value: productosActivos, icon: TrendingUp, color: "#0ea5e9" },
            { title: "Bajo Stock Mínimo", value: productosBajoMinimo, icon: AlertTriangle, color: "#eab308" },
            { title: "Stock Valorizado (S/.)", value: parseFloat(stockValorizado).toFixed(2), icon: DollarSign, color: "#14b8a6" },
            { title: "Proveedores Activos", value: proveedoresActivos, icon: Users, color: "#7c3aed" },
          ].map((kpi, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center text-white p-5 rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${kpi.color}cc, ${kpi.color}99)`,
              }}
            >
              <kpi.icon className="w-8 h-8 mb-2 opacity-90" />
              <p className="text-sm font-medium">{kpi.title}</p>
              <p className="text-2xl font-bold mt-1">{Number(kpi.value).toLocaleString()}</p>
              <div className="w-full h-2 bg-white bg-opacity-30 rounded-full mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (Number(kpi.value) / (totalProductos || 1)) * 100,
                      100
                    )}%`,
                    backgroundColor: kpi.color,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filtros avanzados PC */}
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm w-full max-w-5xl">
          {/* Código */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Código</label>
            <input
              type="text"
              placeholder="Buscar código..."
              className="border border-gray-300 rounded-xl px-3 py-2 w-36 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={filtroAvanzado.codigo}
              onChange={(e) =>
                setFiltroAvanzado({ ...filtroAvanzado, codigo: e.target.value })
              }
            />
          </div>

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Nombre</label>
            <input
              type="text"
              placeholder="Buscar nombre..."
              className="border border-gray-300 rounded-xl px-3 py-2 w-36 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={filtroAvanzado.nombre}
              onChange={(e) =>
                setFiltroAvanzado({ ...filtroAvanzado, nombre: e.target.value })
              }
            />
          </div>

          {/* Stock mínimo */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Stock Mínimo</label>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 rounded-xl px-3 py-2 w-36 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={filtroAvanzado.stockMin}
              onChange={(e) =>
                setFiltroAvanzado({ ...filtroAvanzado, stockMin: e.target.value })
              }
            />
          </div>

          {/* Stock máximo */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Stock Máximo</label>
            <input
              type="number"
              placeholder="100"
              className="border border-gray-300 rounded-xl px-3 py-2 w-36 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={filtroAvanzado.stockMax}
              onChange={(e) =>
                setFiltroAvanzado({ ...filtroAvanzado, stockMax: e.target.value })
              }
            />
          </div>

          {/* Categoría */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Categoría</label>
            <select
              className="border border-gray-300 rounded-xl px-3 py-2 w-44 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
              value={filtroAvanzado.categoria}
              onChange={(e) =>
                setFiltroAvanzado({ ...filtroAvanzado, categoria: e.target.value })
              }
            >
              <option value="">Todas Categorías</option>
              {categoriasUnicas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLA */}
        <div className="w-full flex-1 mt-4">
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

        {/* MODALES */}
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
