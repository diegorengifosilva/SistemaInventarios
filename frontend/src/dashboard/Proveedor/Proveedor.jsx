// C:\Users\diego\PROYECTOS\PROYECTO_INVENTARIO\frontend\src\dashboard\Proveedor\Proveedor.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Search,
  Plus,
  Users,
  BriefcaseBusiness,
  Eye,
  AlertTriangle,
} from "lucide-react";

import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { motion, useScroll, useTransform } from "framer-motion";

import { obtenerProveedores, eliminarProveedor } from "@/services/proveedorService";
import { obtenerProductos } from "@/services/productoService";
import ProveedorDetalleModal from "./ProveedorDetalleModal";
import NuevoProveedor from "../Productos/NuevoProveedor";

export default function Proveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalData, setModalData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.25]);
  const blurValue = useTransform(scrollY, [0, 100], [4, 8]);

  // Cargar proveedores y productos
  useEffect(() => {
    async function fetchData() {
      const provs = await obtenerProveedores();
      setProveedores(provs || []);
      const prods = await obtenerProductos();
      setProductos(prods || []);
    }
    fetchData();
  }, []);

  // Añadir conteo de productos a cada proveedor
  const proveedoresConConteo = proveedores.map((p) => ({
    ...p,
    productos: productos.filter((prod) => prod.proveedor?.ruc === p.ruc),
  }));

  // Filtro simple
  const filtrados = proveedoresConConteo.filter(
    (p) =>
      p.razonSocial.toLowerCase().includes(filtro.toLowerCase()) ||
      p.ruc.toLowerCase().includes(filtro.toLowerCase())
  );

  // Función eliminar (opcional)
  const handleEliminar = async (ruc) => {
    if (!window.confirm("¿Desea eliminar este proveedor?")) return;
    const ok = await eliminarProveedor(ruc);
    if (ok) {
      toast.success("Proveedor eliminado");
      setProveedores(proveedores.filter((p) => p.ruc !== ruc));
    } else {
      toast.error("No se pudo eliminar el proveedor");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col bg-gray-50 font-sans"
    >
      <div className="flex-1 flex flex-col py-6 px-6">
        {/* HEADER */}
        <motion.div
          style={{
            boxShadow: shadowOpacity.get() > 0 ? `0 2px 8px rgba(0,0,0,${shadowOpacity.get()})` : "none",
            backdropFilter: `blur(${blurValue.get()}px)`,
          }}
          className="sticky top-0 z-30 bg-white/90 border-b border-gray-200 rounded-2xl shadow-md px-5 py-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <motion.h1 className="font-bold flex items-center gap-3 truncate text-xl sm:text-2xl">
              <BriefcaseBusiness className="w-6 h-6 text-gray-900" />
              Gestión de Proveedores
            </motion.h1>
            <motion.p className="mt-1 text-gray-600 italic truncate text-sm sm:text-base">
              Gestión de <span className="font-semibold text-blue-600">proveedores</span>.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setOpenModal({})} // abrir modal vacío para "nuevo"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm"
              >
                <Plus className="w-4 h-4" /> Nuevo Proveedor
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full">
          {[
            {
              title: "Total Proveedores",
              value: proveedores.length,
              icon: Users,
              color: "#3b82f6",
            },
            {
              title: "Con Productos",
              value: proveedoresConConteo.filter((p) => p.productos.length > 0).length,
              icon: Box,
              color: "#0ea5e9",
            },
            {
              title: "Sin Productos",
              value: proveedoresConConteo.filter((p) => p.productos.length === 0).length,
              icon: AlertTriangle,
              color: "#eab308",
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
              <kpi.icon className="w-8 h-8 mb-2 opacity-90" />
              <p className="text-sm font-medium">{kpi.title}</p>
              <p className="text-2xl font-bold mt-1">{Number(kpi.value).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Buscador */}
        <div className="w-full mb-4 flex flex-wrap gap-2 items-center">
          <div className="flex items-center w-full md:w-1/3 border rounded-xl px-3 py-2 bg-gray-50">
            <Search className="text-gray-500 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o RUC..."
              className="bg-transparent outline-none px-2 w-full"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="hidden md:block w-full flex-1 overflow-auto">
          <Table
            headers={["RUC", "Razón Social", "Contacto", "# Productos", "Acciones"]}
            data={filtrados}
            renderRow={(p) => [
              p.ruc,
              p.razonSocial,
              p.contacto || "-",
              p.productos.length,
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

        {/* Modal de detalle */}
        {modalData && (
          <ProveedorDetalleModal
            proveedor={modalData}
            productos={modalData.productos}
            onClose={() => setModalData(null)}
          />
        )}

        <NuevoProveedor
        open={openModal}
        onClick={() => setOpenModal(true)}
        onClose={() => setOpenModal(false)}
        onSave={async (proveedor) => {
            // Aquí 'proveedor' ya viene del modal recién creado
            toast.success("Proveedor creado correctamente");

            // Recargar lista de proveedores desde el backend
            const data = await obtenerProveedores();
            setProveedores(data || []);
        }}
        />
      </div>
    </motion.div>
  );
}
