import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { crearProducto } from "@/services/productoService"; // ← IMPORTANTE
import { obtenerProveedores } from "@/services/proveedorService"; // ← NUEVO

export default function NuevoProducto({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    stock: "",
    precio: "",
    categoria: "",
    rucProveedor: "",
  });

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  //  Cargar proveedores al abrir modal
  // =========================
  useEffect(() => {
    if (open) {
      obtenerProveedores()
        .then((data) => setProveedores(data))
        .catch(() => toast.error("Error cargando proveedores"));
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.categoria) {
      toast.error("Debe seleccionar una categoría");
      return;
    }
    if (!form.rucProveedor) {
      toast.error("Debe seleccionar un proveedor");
      return;
    }

    const proveedorSeleccionado = proveedores.find(
      (p) => p.ruc === form.rucProveedor
    );

    if (!proveedorSeleccionado) {
      toast.error("Proveedor no válido");
      return;
    }

    const payload = {
      codigo: form.codigo,
      nombre: form.nombre,
      stockActual: Number(form.stock),
      precioUnitario: Number(form.precio),
      categoria: form.categoria,
      proveedor: {
        ruc: proveedorSeleccionado.ruc,
        razonSocial: proveedorSeleccionado.razonSocial,
      },
    };

    setLoading(true);
    const creado = await crearProducto(payload);
    setLoading(false);

    if (creado) {
      toast.success("Producto creado correctamente!");
      if (onSave) onSave(payload); // actualiza tabla padre
      setForm({ codigo: "", nombre: "", stock: "", precio: "", categoria: "", rucProveedor: "" });
      onClose();
    } else {
      toast.error("Error al crear el producto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-lg shadow-md p-4 text-xs sm:text-sm">

        {/* ENCABEZADO */}
        <DialogHeader className="flex flex-col items-center text-center mb-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-blue-100 text-blue-600 p-1.5 rounded-full mb-1"
          >
            <Box className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
          <DialogTitle className="text-sm font-semibold text-gray-800">
            Agregar Nuevo Producto
          </DialogTitle>
        </DialogHeader>

        {/* FORMULARIO */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {/* Código */}
          <div>
            <label className="text-gray-600 text-xs">Código</label>
            <input
              type="text"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="text-gray-600 text-xs">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="text-gray-600 text-xs">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label className="text-gray-600 text-xs">Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-gray-600 text-xs">Categoría</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Seleccione…</option>
              <option value="ALIMENTO">Alimento</option>
              <option value="BEBIDA">Bebida</option>
              <option value="ASEO">Aseo</option>
              <option value="HIGIENE">Higiene</option>
              <option value="LACTEO">Lácteo</option>
              <option value="TELA">Tela</option>
              <option value="PLASTICO">Plástico</option>
              <option value="METALICO">Metálico</option>
              <option value="CERAMICA">Cerámica</option>
            </select>
          </div>

          {/* Proveedor */}
          <div>
            <label className="text-gray-600 text-xs">Proveedor</label>
            <select
              name="rucProveedor"
              value={form.rucProveedor}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Seleccione un proveedor…</option>
              {proveedores.map((p) => (
                <option key={p.ruc} value={p.ruc}>
                  {p.razonSocial} ({p.ruc})
                </option>
              ))}
            </select>
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex justify-end mt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="text-gray-700 border-gray-300 hover:bg-gray-100 text-xs sm:text-sm px-3 py-1"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1"
            >
              {loading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </DialogFooter>
        </motion.form>

      </DialogContent>
    </Dialog>
  );
}
