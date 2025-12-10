// src/dashboard/transacciones/TransaccionesDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import SelectField from "@/components/ui/SelectField";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Box, ArrowDownCircle, ArrowUpCircle, AlertTriangle, Download } from "lucide-react";

import { obtenerTransacciones, crearTransaccion } from "@/services/transaccionService";
import { obtenerProductos } from "@/services/productoService";

export default function TransaccionesDashboard() {
  const [transacciones, setTransacciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    texto: "",
    tipo: "TODOS",
    producto: "",
    usuario: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "ENTRADA",
    productoCodigo: "",
    cantidad: "",
    razon: "",
    nota: "",
  });
  const [cargando, setCargando] = useState(true);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.25]);
  const blurValue = useTransform(scrollY, [0, 100], [4, 8]);

  // ======= Cargar datos =======
  useEffect(() => {
    async function fetchData() {
      try {
        const [trans, prods] = await Promise.all([obtenerTransacciones(), obtenerProductos()]);
        setTransacciones(trans || []);
        setProductos(prods || []);
      } catch (error) {
        console.error(error);
        toast.error("Error cargando transacciones o productos");
      } finally {
        setCargando(false);
      }
    }
    fetchData();
  }, []);

  // ======= Filtrado avanzado =======
  const transaccionesFiltradas = transacciones.filter((t) => {
    const { texto, tipo, producto, usuario, fechaInicio, fechaFin } = filtros;
    const busqueda = texto.toLowerCase();
    let coincide = 
      t.tipo.toLowerCase().includes(busqueda) ||
      t.producto?.nombre.toLowerCase().includes(busqueda) ||
      t.usuario?.toLowerCase().includes(busqueda);

    if (tipo !== "TODOS") coincide = coincide && t.tipo === tipo;
    if (producto) coincide = coincide && t.producto?.codigo === producto;
    if (usuario) coincide = coincide && t.usuario.toLowerCase().includes(usuario.toLowerCase());
    if (fechaInicio) coincide = coincide && new Date(t.fecha) >= new Date(fechaInicio);
    if (fechaFin) coincide = coincide && new Date(t.fecha) <= new Date(fechaFin);

    return coincide;
  });

  // ======= KPIs =======
  const totalTransacciones = transacciones.length;
  const totalEntradas = transacciones.filter((t) => t.tipo === "ENTRADA").length;
  const totalSalidas = transacciones.filter((t) => t.tipo === "SALIDA").length;
  const stockBajo = productos.filter((p) => p.stockActual < 10).length;

  // ======= Guardar movimiento =======
  const guardarMovimiento = async () => {
    if (!nuevoMovimiento.productoCodigo || !nuevoMovimiento.cantidad || !nuevoMovimiento.razon) {
      return toast.warning("Completa todos los campos obligatorios");
    }
    const producto = productos.find((p) => p.codigo === nuevoMovimiento.productoCodigo);
    if (!producto) return toast.warning("Producto no válido");

    const movimiento = {
      tipo: nuevoMovimiento.tipo,
      producto,
      cantidad: parseInt(nuevoMovimiento.cantidad),
      razon: nuevoMovimiento.razon,
      nota: nuevoMovimiento.nota,
      fecha: new Date(),
      usuario: "ADMIN",
    };

    const ok = await crearTransaccion(movimiento);
    if (ok) {
      const trans = await obtenerTransacciones();
      setTransacciones(trans || []);
      setModalAbierto(false);
      setNuevoMovimiento({ tipo: "ENTRADA", productoCodigo: "", cantidad: "", razon: "", nota: "" });
      toast.success("Movimiento registrado");
    } else {
      toast.error("No se pudo registrar el movimiento");
    }
  };

  // ======= Exportar Excel =======
  const exportarExcel = () => {
    if (!transaccionesFiltradas.length) return toast.info("No hay datos para exportar");

    const headers = ["ID", "Tipo", "Producto", "Cantidad", "Razón", "Usuario", "Fecha"];
    const rows = transaccionesFiltradas.map((t) => [
      t.idTransaccion,
      t.tipo,
      t.producto?.nombre || "",
      t.cantidad,
      t.razon || "",
      t.usuario,
      new Date(t.fecha).toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    ]);

    const tableHTML = `
      <table>
        <thead>
          <tr style="background-color:#008080;color:white;font-weight:bold;text-align:center;">
            ${headers.map((h) => `<th>${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((r) => {
              const color = r[1] === "ENTRADA" ? "#10b981" : r[1] === "SALIDA" ? "#ef4444" : "#fff";
              return `<tr style="background-color:${color}20">
                <td style="text-align:center">${r[0]}</td>
                <td style="text-align:center">${r[1]}</td>
                <td>${r[2]}</td>
                <td style="text-align:right">${r[3]}</td>
                <td>${r[4]}</td>
                <td>${r[5]}</td>
                <td style="text-align:center">${r[6]}</td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    `;

    const template = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8">
        <style>
          table, th, td { border:1px solid #000; border-collapse:collapse; }
          th { font-weight:bold; background-color:#008080; color:#fff; text-align:center; }
          td { font-size:12px; padding:2px; }
        </style>
      </head>
      <body>{table}</body>
      </html>
    `;
    const uri = "data:application/vnd.ms-excel;base64,";
    const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));
    const format = (s, c) => s.replace("{table}", c.table);
    const link = document.createElement("a");
    link.href = uri + base64(format(template, { table: tableHTML }));
    link.download = `Transacciones_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel generado correctamente");
  };

  if (cargando) return <div className="p-4">Cargando transacciones y productos...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen w-full flex flex-col bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col py-6 px-6">

        {/* HEADER */}
        <motion.div
          style={{ boxShadow: shadowOpacity.get() > 0 ? `0 2px 8px rgba(0,0,0,${shadowOpacity.get()})` : "none", backdropFilter: `blur(${blurValue.get()}px)` }}
          className="sticky top-0 z-30 bg-white/90 border-b border-gray-200 rounded-2xl shadow-md px-5 py-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex-1 min-w-0">
            <motion.h1 className="font-bold flex items-center gap-3 truncate text-xl sm:text-2xl">
              <Box className="w-6 h-6 text-gray-900" /> Gestión de Transacciones
            </motion.h1>
            <motion.p className="mt-1 text-gray-600 italic truncate text-sm sm:text-base">
              Registro y gestión de <span className="font-semibold text-blue-600">movimientos</span>.
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button onClick={() => setModalAbierto(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm">
              <Plus className="w-4 h-4" /> Nuevo Movimiento
            </Button>
            <Button onClick={exportarExcel} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
              <Download className="w-4 h-4" /> Exportar Excel
            </Button>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 w-full">
          {[
            { title: "Total Transacciones", value: totalTransacciones, icon: Box, color: "#3b82f6" },
            { title: "Entradas", value: totalEntradas, icon: ArrowDownCircle, color: "#10b981" },
            { title: "Salidas", value: totalSalidas, icon: ArrowUpCircle, color: "#ef4444" },
            { title: "Stock Bajo", value: stockBajo, icon: AlertTriangle, color: "#f59e0b" },
          ].map((kpi, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.02 }} className="flex flex-col items-center justify-center text-white p-5 rounded-xl shadow-sm"
              style={{ background: `linear-gradient(135deg, ${kpi.color}cc, ${kpi.color}99)` }}>
              <kpi.icon className="w-8 h-8 mb-2 opacity-90" />
              <p className="text-sm font-medium">{kpi.title}</p>
              <p className="text-2xl font-bold mt-1">{Number(kpi.value).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* FILTROS AVANZADOS */}
        <div className="w-full mb-4 flex flex-wrap gap-2 items-center">
          <Input type="text" placeholder="Buscar texto..." className="w-full md:w-1/4"
            value={filtros.texto} onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })} />
          <SelectField label="Tipo" value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            options={[{ value: "TODOS", nombre: "Todos" }, { value: "ENTRADA", nombre: "Entradas" }, { value: "SALIDA", nombre: "Salidas" }]} />
          <SelectField label="Producto" value={filtros.producto} onChange={(e) => setFiltros({ ...filtros, producto: e.target.value })}
            options={[{ value: "", nombre: "Todos" }, ...productos.map((p) => ({ value: p.codigo, nombre: p.nombre }))]} />
        </div>

        {/* TABLA */}
        <div className="hidden md:block w-full flex-1 overflow-auto">
          <Table
            headers={["ID", "Tipo", "Producto", "Cantidad", "Razón", "Usuario", "Fecha"]}
            data={transaccionesFiltradas}
            renderRow={(t) => [
              t.idTransaccion,
              t.tipo,
              t.producto?.nombre || "Sin producto",
              t.cantidad,
              t.razon,
              t.usuario,
              new Date(t.fecha).toLocaleString(),
            ]}
          />
        </div>

        {/* MOBILE */}
        <div className="md:hidden flex flex-col gap-3">
          {transaccionesFiltradas.map((t) => (
            <motion.div key={t.idTransaccion} className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-700">{t.tipo}</span>
                <span className="text-sm text-gray-500">{new Date(t.fecha).toLocaleString()}</span>
              </div>
              <p className="text-gray-600"><span className="font-semibold">Producto:</span> {t.producto?.nombre || "Sin producto"}</p>
              <p className="text-gray-600"><span className="font-semibold">Cantidad:</span> {t.cantidad}</p>
              <p className="text-gray-600"><span className="font-semibold">Razón:</span> {t.razon}</p>
              <p className="text-gray-600"><span className="font-semibold">Usuario:</span> {t.usuario}</p>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent className="max-w-md">
            <div className="space-y-2 mt-2">
              <SelectField label="Tipo" value={nuevoMovimiento.tipo} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, tipo: e.target.value })}
                options={[{ value: "ENTRADA", nombre: "Entrada" }, { value: "SALIDA", nombre: "Salida" }]} />
              <SelectField label="Producto" value={nuevoMovimiento.productoCodigo} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, productoCodigo: e.target.value })}
                options={productos.map((p) => ({ value: p.codigo, nombre: p.nombre }))} />
              <Input type="number" placeholder="Cantidad" value={nuevoMovimiento.cantidad} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, cantidad: e.target.value })} />
              <Input type="text" placeholder="Razón" value={nuevoMovimiento.razon} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, razon: e.target.value })} />
              <Input type="text" placeholder="Nota (opcional)" value={nuevoMovimiento.nota} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, nota: e.target.value })} />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
                <Button onClick={guardarMovimiento}>Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </motion.div>
  );
}
