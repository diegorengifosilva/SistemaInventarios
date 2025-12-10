import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { crearProveedor } from "@/services/proveedorService"; // ← IMPORTANTE

export default function NuevoProveedor({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    ruc: "",
    razonSocial: "",
    contacto: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.ruc || !form.razonSocial) {
      toast.error("RUC y Razón Social son obligatorios");
      return;
    }

    const payload = {
      ruc: form.ruc,
      razonSocial: form.razonSocial,
      contacto: form.contacto,
    };

    setLoading(true);
    const creado = await crearProveedor(payload);
    setLoading(false);

    if (creado) {
      toast.success("Proveedor creado correctamente!");
      if (onSave) onSave(payload); // actualizar tabla padre
      setForm({ ruc: "", razonSocial: "", contacto: "" });
      onClose();
    } else {
      toast.error("Error al crear el proveedor");
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
            className="bg-yellow-100 text-yellow-600 p-1.5 rounded-full mb-1"
          >
            <BriefcaseBusiness className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
          <DialogTitle className="text-sm font-semibold text-gray-800">
            Agregar Nuevo Proveedor
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
          {/* RUC */}
          <div>
            <label className="text-gray-600 text-xs">RUC</label>
            <input
              type="text"
              name="ruc"
              value={form.ruc}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>

          {/* Razón Social */}
          <div>
            <label className="text-gray-600 text-xs">Razón Social</label>
            <input
              type="text"
              name="razonSocial"
              value={form.razonSocial}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
          </div>

          {/* Contacto */}
          <div>
            <label className="text-gray-600 text-xs">Contacto</label>
            <input
              type="text"
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
            />
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
              className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs sm:text-sm px-3 py-1"
            >
              {loading ? "Guardando..." : "Guardar Proveedor"}
            </Button>
          </DialogFooter>
        </motion.form>

      </DialogContent>
    </Dialog>
  );
}
