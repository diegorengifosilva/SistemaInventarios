// src/cotizaciones/InfoTabs.jsx

import api from "@/services/api";
import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Table from "@/components/ui/table";
import {
  FolderClosed,
  Files,
  Paperclip,
  ClipboardList,
  Tag,
  Calendar,
  DollarSign,
  Settings,
  Building,
  User,
  UserCheck,
  Phone,
  Smartphone,
  Mail,
  TrendingUp,
  CreditCard,
  MapPin,
  Clock,
  FileText,
  Percent,
  Landmark,
  ChevronsRight,
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  Edit2,
  Trash2,
  FileCheck,
  SquareStar,
  Send,
  RotateCcwSquare,
  BanknoteArrowDown,
  FileSpreadsheet,
  Copy,
  FilePlus,
  Trash,
  MessageSquareMore,
  ChartScatter,
} from "lucide-react";
import InputField from "./InputField";
import SelectField from "./SelectField";

export default function InfoTabs({
  dashboardName,
  data,        // datos completos de la cotización
  tabsToShow,  // tabs personalizados si deseas
  suministros,
  servicios,
  openCondiciones,
  setOpenCondiciones,
  openGenerarCodigo,
  setOpenGenerarCodigo,
  openDescuentos,
  setOpenDescuentos,
  openEnviarCoti,
  setOpenEnviarCoti,
}) {

  const [activeTab, setActiveTab] = useState("datos");
  const [clientes, setClientes] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEncargado, setSelectedEncargado] = useState(null);

  // ===============================
  // Configuración de tabs (estilo CAJA CHICA)
  // ===============================
  const TAB_CONFIG = {
    CotizacionModal: ["datos"],
  };

  const defaultTabs = TAB_CONFIG[dashboardName] || ["datos"];
  const activeTabs = tabsToShow?.length ? tabsToShow : defaultTabs;

  //  Grid dinámico según cantidad de pestañas activas
  const totalTabs = activeTabs.length;

  const gridCols =
    totalTabs === 1 ? "grid-cols-1" :
    totalTabs === 2 ? "grid-cols-2" :
    totalTabs === 3 ? "grid-cols-3" :
    totalTabs === 4 ? "grid-cols-4" :
    "grid-cols-4";

  // ===========
  // CLIENTES
  // ===========
  useEffect(() => {
      const fetchClientes = async () => {
          const res = await api.get("/cotizaciones/clientes/");
          setClientes(res.data);
      };
      fetchClientes();
  }, []);

  // ===========
  // OPCIONES
  // ===========
  const probOptions = [
    { id: "0", nombre: "Baja" },
    { id: "1", nombre: "Media" },
    { id: "2", nombre: "Alta" },
    { id: "3", nombre: "Muy Alta" },
  ];

  const tipoOptions = [
    { id: "Producto", nombre: "Producto" },
    { id: "Servicio", nombre: "Servicio" },
    { id: "Venta", nombre: "Venta" },
  ];

  const areasOptions = [
    { id: "0", nombre: "Gerencia General" },
    { id: "1", nombre: "Industria" },
    { id: "2", nombre: "Mineria" },
    { id: "3", nombre: "Mantenimiento" },
    { id: "4", nombre: "Petroquimica" },
    { id: "5", nombre: "Administracion" },
    { id: "51", nombre: "Contabilidad" },
    { id: "52", nombre: "Tecnología de la Información" },
    { id: "53", nombre: "Logistica - Almacen" },
    { id: "54", nombre: "Recursos Humanos" },
    { id: "6", nombre: "Comercial" },
    { id: "7", nombre: "SIG. HSEQ" },
    { id: "8", nombre: "Seguridad de Maquinaria" },
    { id: "9", nombre: "Comite CSSO" },
  ];

  const estadosOptions = [
    { id: "1", nombre: "Adjudicado" },
    { id: "2", nombre: "Pendiente" },
    { id: "3", nombre: "Perdida" },
    { id: "4", nombre: "Anulado" },
    { id: "5", nombre: "Postergada" },
    { id: "6", nombre: "En Seguimiento" },
  ];

  const monedasOptions = [
    { id: "S", nombre: "Soles" },
    { id: "D", nombre: "Dólares" },
  ];

  const unidadOptions =[
    { id: "D", nombre: "Dias" },
    { id: "S", nombre: "Semanas" },
    { id: "M", nombre: "Meses" },
  ]

  // =====================
  // TABLAS SUMINISTROS
  // =====================
  const grupos = {};

  // 1) Primero detectar todas las cabeceras (nig=0)
  suministros
    .filter(item => item.nig === 0)
    .forEach(header => {
      grupos[header.cog] = {
        titulo: header.nog,   // nombre del grupo
        items: []             // aquí meteremos sus filas hijas
      };
    });

  // 2) Ahora agregar las filas hijas basadas en cog y nig > 0
  suministros
    .filter(item => item.nig > 0)
    .forEach(item => {
      if (grupos[item.cog]) {
        grupos[item.cog].items.push(item);
      }
    });

  // =======================
  // Memoización para no recalcular innecesariamente
  // =======================
  const [serviciosProcesados, setServiciosProcesados] = React.useState(null);

  // Cuando cambie servicios, actualizar serviciosProcesados
  React.useEffect(() => {
    if (servicios) {
      setServiciosProcesados(servicios);
    }
  }, [servicios]);

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          className={`grid ${
            activeTabs.length === 1
              ? "grid-cols-1"
              : activeTabs.length === 2
              ? "grid-cols-2"
              : activeTabs.length === 3
              ? "grid-cols-3"
              : "grid-cols-4"
          } gap-2 mb-4 bg-gray-100 rounded-xl p-1`}
        >
          {activeTabs.includes("datos") && (
            <TabsTrigger
              value="datos"
              className="flex items-center gap-2 justify-center text-xs sm:text-sm data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <FolderClosed className="w-4 h-4 sm:w-5 sm:h-5" /> Datos
            </TabsTrigger>
          )}

          {activeTabs.includes("suministros") && (
            <TabsTrigger
              value="suministros"
              className="flex items-center gap-2 justify-center text-xs sm:text-sm data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <FolderClosed className="w-4 h-4 sm:w-5 sm:h-5" /> Suministros
            </TabsTrigger>
          )}

          {activeTabs.includes("servicios") && (
            <TabsTrigger
              value="servicios"
              className="flex items-center gap-2 justify-center text-xs sm:text-sm data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <FolderClosed className="w-4 h-4 sm:w-5 sm:h-5" /> Servicios
            </TabsTrigger>
          )}

          {activeTabs.includes("gestion") && (
            <TabsTrigger
              value="gestion"
              className="flex items-center gap-2 justify-center text-xs sm:text-sm data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <FolderClosed className="w-4 h-4 sm:w-5 sm:h-5" /> Gestión
            </TabsTrigger>
          )}
        </TabsList>

        {/* DETALLES COTIZACIÓN */}
        {activeTabs.includes("datos") && (
          <TabsContent value="datos" className="space-y-3">

            <Card className="rounded-xl shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-3 space-y-3">

                {/* FILA SUPERIOR */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                  {/* IZQUIERDA */}
                  <div className="space-y-2 border rounded-lg bg-white p-2.5 shadow-sm text-xs">

                    <InputField inline size="sm" label="Cotización Nro." value={data.numero || "-"} readOnly />
                    <InputField inline size="sm" label="Fecha" value={data.fecha || "-"} readOnly />
                    <InputField inline size="sm" label="Referencia" value={data.referencia || ""} onChange={(e) => onEdit("referencia", e.target.value)} />

                    <SelectField
                      inline
                      size="sm"
                      label="Para"
                      name="cliente"
                      value={data.cliente_codigo || ""}
                      onChange={(e) => onEdit("cliente_codigo", e.target.value)}
                      options={clientes.map(c => ({ id: c.codigo, nombre: c.nombre }))}
                    />

                    <InputField
                      inline
                      size="sm"
                      label="Atención"
                      value={data.cliente_nombre || ""}
                      onChange={(e) => onEdit("cliente_nombre", e.target.value)}
                      trailingIcon={
                        <button type="button" onClick={() => setModalOpen(prev => ({ ...prev, atencion: true }))}>
                          <ChevronsRight className="w-4 h-4 text-gray-600" />
                        </button>
                      }
                    />

                    <InputField inline size="sm" label="Cargo" value={data.cargo || ""} onChange={(e) => onEdit("cargo", e.target.value)} />

                    <div className="grid grid-cols-2 gap-2">
                      <InputField inline size="sm" label="Teléfono" value={data.teler || ""} onChange={(e) => onEdit("teler", e.target.value)} />
                      <InputField inline size="sm" label="Móvil" value={data.movir || ""} onChange={(e) => onEdit("movir", e.target.value)} />
                    </div>

                    <InputField inline size="sm" label="Email" value={data.mailr || ""} onChange={(e) => onEdit("mailr", e.target.value)} />

                    <SelectField
                      inline
                      size="sm"
                      label="Probabilidad"
                      value={data.prob || ""}
                      onChange={(e) => onEdit("prob", e.target.value)}
                      options={probOptions}
                    />

                    <InputField
                      inline
                      size="sm"
                      label="Total Cotización"
                      value={data.tot_c ? `S/ ${Number(data.tot_c).toFixed(2)}` : "-"}
                      readOnly
                    />

                  </div>

                  {/* DERECHA */}
                  <div className="space-y-2 border rounded-lg bg-white p-2.5 shadow-sm text-xs">

                    <SelectField inline size="sm" label="Tipo Cotización" value={data.tipo_nombre || ""} onChange={(e) => onEdit("tipo_nombre", e.target.value)} options={tipoOptions} />

                    <SelectField inline size="sm" label="Área" value={data.area_codigo || ""} onChange={(e) => onEdit("area_codigo", e.target.value)} options={areasOptions} />

                    <InputField inline size="sm" label="Forma de Pago" value={data.fpago || ""} onChange={(e) => onEdit("fpago", e.target.value)} />

                    <SelectField inline size="sm" label="Estado" value={data.estado_codigo || ""} onChange={(e) => onEdit("estado_codigo", e.target.value)} options={estadosOptions} />

                    <InputField inline size="sm" label="Lugar Entrega" value={data.lugar || ""} onChange={(e) => onEdit("lugar", e.target.value)} />

                    <div className="grid grid-cols-2 gap-2">
                      <InputField inline size="sm" label="Entrega Suministro" value={data.plazo || "0"} onChange={(e) => onEdit("plazo", e.target.value)} />
                      <SelectField inline size="sm" label="Unidad" value={data.tot_d || ""} onChange={(e) => onEdit("tot_d", e.target.value)} options={unidadOptions} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <InputField inline size="sm" label="Entrega Servicios" value={data.por_c || "0"} onChange={(e) => onEdit("por_c", e.target.value)} />
                      <SelectField inline size="sm" label="Unidad" value={data.tot_s || ""} onChange={(e) => onEdit("tot_s", e.target.value)} options={unidadOptions} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <SelectField inline size="sm" label="Tipo Moneda" value={data.tmone || ""} onChange={(e) => onEdit("tmone", e.target.value)} options={monedasOptions} />
                      <InputField inline size="sm" label="TC" value={data.tcamb || ""} onChange={(e) => onEdit("tcamb", e.target.value)} />
                    </div>

                    <InputField inline size="sm" label="I.G.V." value={data.igv ? `${data.igv}%` : "-"} readOnly />

                    <div className="grid grid-cols-2 gap-2">
                      <InputField inline size="sm" label="Validez Oferta" value={data.valid || "0"} onChange={(e) => onEdit("valid", e.target.value)} />
                      <SelectField inline size="sm" label="Unidad" value={data.acu_s || ""} onChange={(e) => onEdit("acu_s", e.target.value)} options={unidadOptions} />
                    </div>

                  </div>
                </div>

                {/* SEPARADOR */}
                <div className="flex items-center">
                  <h3 className="text-xs font-bold text-gray-800 mr-3">CONTACTOS</h3>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* CONTACTOS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                  {/* Comercial */}
                  <div className="space-y-2 border rounded-lg bg-white p-2.5 shadow-sm text-xs">
                    <h4 className="text-xs font-semibold border-b pb-1">Comercial</h4>

                    <InputField
                      inline size="sm" label="Nombre"
                      value={data.nombc || ""}
                      onChange={(e) => onEdit("nombc", e.target.value)}
                      trailingIcon={
                        <button type="button" onClick={() => setModalOpen(prev => ({ ...prev, comercial: true }))}>
                          <ChevronsRight className="w-4 h-4 text-gray-600" />
                        </button>
                      }
                    />

                    <InputField inline size="sm" label="Teléfono" value={data.telec || ""} onChange={(e) => onEdit("telec", e.target.value)} />
                    <InputField inline size="sm" label="Móvil 01" value={data.mov1c || ""} onChange={(e) => onEdit("mov1c", e.target.value)} />
                    <InputField inline size="sm" label="Móvil 02" value={data.mov2c || ""} onChange={(e) => onEdit("mov2c", e.target.value)} />
                    <InputField inline size="sm" label="Móvil 03" value={data.mov3c || ""} onChange={(e) => onEdit("mov3c", e.target.value)} />
                    <InputField inline size="sm" label="Email" value={data.mailc || ""} onChange={(e) => onEdit("mailc", e.target.value)} />
                  </div>

                  {/* Técnico */}
                  <div className="space-y-2 border rounded-lg bg-white p-2.5 shadow-sm text-xs">
                    <h4 className="text-xs font-semibold border-b pb-1">Técnico</h4>

                    <InputField
                      inline size="sm" label="Nombre"
                      value={data.nombt || ""}
                      onChange={(e) => onEdit("nombt", e.target.value)}
                      trailingIcon={
                        <button type="button" onClick={() => setModalOpen(prev => ({ ...prev, tecnico: true }))}>
                          <ChevronsRight className="w-4 h-4 text-gray-600" />
                        </button>
                      }
                    />

                    <InputField inline size="sm" label="Teléfono" value={data.telet || ""} onChange={(e) => onEdit("telet", e.target.value)} />
                    <InputField inline size="sm" label="Móvil 01" value={data.mov1t || ""} onChange={(e) => onEdit("mov1t", e.target.value)} />
                    <InputField inline size="sm" label="Móvil 02" value={data.mov2t || ""} onChange={(e) => onEdit("mov2t", e.target.value)} />
                    <InputField inline size="sm" label="Móvil 03" value={data.mov3t || ""} onChange={(e) => onEdit("mov3t", e.target.value)} />
                    <InputField inline size="sm" label="Email" value={data.mailt || ""} onChange={(e) => onEdit("mailt", e.target.value)} />
                  </div>

                </div>

              </CardContent>
            </Card>

          </TabsContent>
        )}

        {/* SUMINISTROS */}
        {activeTabs.includes("suministros") && (
          <TabsContent value="suministros" className="space-y-6">
            <Card className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-3 md:p-4">
                <div className="overflow-x-auto">

                  {Object.entries(grupos).map(([cog, grupo]) => (
                    <div key={cog} className="mb-8">

                      {/* CABECERA DEL GRUPO */}
                      <div className="font-semibold text-sm py-2 px-1 bg-gray-100 rounded">
                        {grupo.titulo}
                      </div>

                      {/* TABLA DEL GRUPO */}
                      <table className="min-w-full text-sm text-left text-gray-700 mt-2">
                        <thead className="bg-gray-200 text-xs uppercase">
                          <tr>
                            <th className="px-3 py-2">Nro</th>
                            <th className="px-3 py-2">Código</th>
                            <th className="px-3 py-2">Descripción</th>
                            <th className="px-3 py-2">Proveedor</th>
                            <th className="px-3 py-2">U.M.</th>
                            <th className="px-3 py-2">Cant</th>
                            <th className="px-3 py-2">Valor</th>
                            <th className="px-3 py-2">Total</th>
                          </tr>
                        </thead>

                        <tbody>
                          {grupo.items.map((item, index) => (
                            <tr key={item.num} className="border-b border-gray-200">
                              <td className="px-3 py-2">{index + 1}</td>
                              <td className="px-3 py-2">{item.cod}</td>
                              <td className="px-3 py-2">{item.des}</td>
                              <td className="px-3 py-2">{item.pro}</td>
                              <td className="px-3 py-2">{item.tde}</td>
                              <td className="px-3 py-2">{item.can}</td>
                              <td className="px-3 py-2">{item.val}</td>
                              <td className="px-3 py-2">{item.tot}</td>
                            </tr>
                          ))}

                          {/* SUBTOTAL */}
                          <tr className="font-bold bg-gray-100">
                            <td colSpan={7} className="px-3 py-2 text-right">
                              TOTAL:
                            </td>
                            <td className="px-3 py-2">
                              {grupo.items.reduce((acc, it) => acc + (Number(it.tot) || 0), 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}

                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* SERVICIOS */}
        {activeTabs.includes("servicios") && serviciosProcesados && (
          <TabsContent value="servicios" className="space-y-6">
            <Card className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-3 md:p-4">

                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {serviciosProcesados.tituloGeneral || "Servicios"}
                </h2>

                <div className="overflow-x-auto space-y-10">
                  {(serviciosProcesados.subgrupos || []).map((sub, idx) => (
                    <div key={idx}>
                      <div className="font-semibold text-sm py-2 px-2 bg-gray-100 rounded">
                        {sub.titulo}
                      </div>

                      <table className="min-w-full text-sm text-left text-gray-700 mt-2">
                        <thead className="bg-gray-200 text-xs uppercase">
                          <tr>
                            <th className="px-3 py-2">Nro</th>
                            <th className="px-3 py-2">Código</th>
                            <th className="px-3 py-2">Descripción</th>
                            <th className="px-3 py-2">Lugar</th>
                            <th className="px-3 py-2">Cant</th>
                            <th className="px-3 py-2">Valor</th>
                            <th className="px-3 py-2">Total</th>
                          </tr>
                        </thead>

                        <tbody>
                          {(sub.items || []).map((item, index) => (
                            <tr key={item.num} className="border-b border-gray-200">
                              <td className="px-3 py-2">{index + 1}</td>
                              <td className="px-3 py-2">{item.cod}</td>
                              <td className="px-3 py-2">{item.des}</td>
                              <td className="px-3 py-2"></td>
                              <td className="px-3 py-2">{item.can}</td>
                              <td className="px-3 py-2">{item.val}</td>
                              <td className="px-3 py-2">{item.tot}</td>
                            </tr>
                          ))}

                          <tr className="font-bold bg-gray-100">
                            <td colSpan={6} className="px-3 py-2 text-right">TOTAL:</td>
                            <td className="px-3 py-2">
                              {(sub.items || []).reduce((acc, it) => acc + (Number(it.tot) || 0), 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* GESTIÓN */}
        {activeTabs.includes("gestion") && (
          <TabsContent value="gestion" className="space-y-6">
            <Card className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
              <CardContent className="p-3 md:p-4">
                {/* SECCIÓN ADICIONALES */}
                <div className="space-y-4 mt-6">
                  {/* SEPARADOR */}
                  <div className="flex items-center my-2">
                    <h3 className="text-xl font-bold text-gray-800 mr-4">ADICIONALES</h3>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* COLUMNA 1 */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOpenCondiciones(true)}
                          className="p-2 rounded-full border border-sky-400 text-sky-400 hover:bg-sky-50 transition"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">
                          Condiciones Generales de la Cotización
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOpenGenerarCodigo(true)}
                          className="p-2 rounded-full border border-emerald-500 text-emerald-500 hover:bg-emerald-50 transition"
                        >
                          <SquareStar className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Generar Código Automático</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-violet-500 text-violet-500 hover:bg-violet-50 transition">
                          <FileText className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Generar Archivo PDF</span>
                      </div>
                    </div>

                    {/* COLUMNA 2 */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOpenDescuentos(true)}
                          className="p-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-50 transition"
                        >
                          <BanknoteArrowDown className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Descuentos</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setOpenEnviarCoti(true)}
                          className="p-2 rounded-full border border-indigo-500 text-indigo-500 hover:bg-indigo-50 transition"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Enviar PDF Adjunto a Correo Electrónico</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-rose-500 text-rose-500 hover:bg-rose-50 transition">
                          <RotateCcwSquare className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Retornar Cotización para su corrección</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN REPORTES */}
                <div className="space-y-4 mt-6">
                  {/* SEPARADOR */}
                  <div className="flex items-center my-2">
                    <h3 className="text-xl font-bold text-gray-800 mr-4">REPORTES</h3>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* COLUMNA 1 */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-cyan-500 text-cyan-500 hover:bg-cyan-50 transition">
                          <FileText className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Reporte Suministros</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-lime-500 text-lime-500 hover:bg-lime-50 transition">
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Reporte Suministros XLS</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-50 transition">
                          <FileText className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Reporte Servicios</span>
                      </div>
                    </div>

                    {/* COLUMNA 2 */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-amber-500 text-amber-500 hover:bg-amber-50 transition">
                          <FileText className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Reporte Detallado de Cotización</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition">
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Reporte Detallado de Cotización XLS</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition">
                          <FileText className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Reporte de Resumen</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN UTILITARIOS */}
                <div className="space-y-4 mt-6">
                  {/* SEPARADOR */}
                  <div className="flex items-center my-2">
                    <h3 className="text-xl font-bold text-gray-800 mr-4">UTILITARIOS</h3>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* COLUMNA 1 */}
                    <div className="flex flex-col space-y-2">
                      <div className="relative flex items-center gap-2">
                        {/* Botón */}
                        <button
                          onClick={() => setOpen(!open)}
                          className="p-2 rounded-full border border-sky-400 text-sky-400 hover:bg-sky-50 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Generar una Copia de la Cotización</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-emerald-400 text-emerald-400 hover:bg-emerald-50 transition">
                          <FilePlus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Generar una Nueva Versión de la Cotización</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-rose-400 text-rose-400 hover:bg-rose-50 transition">
                          <Trash className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Eliminar Cotización</span>
                      </div>
                    </div>

                    {/* COLUMNA 2 */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-amber-400 text-amber-400 hover:bg-amber-50 transition">
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Adjuntos</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-indigo-400 text-indigo-400 hover:bg-indigo-50 transition">
                          <MessageSquareMore className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Mensajes</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-purple-400 text-purple-400 hover:bg-purple-50 transition">
                          <Phone className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Seguimiento</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-teal-400 text-teal-400 hover:bg-teal-50 transition">
                          <ChartScatter className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">Probabilidad</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};