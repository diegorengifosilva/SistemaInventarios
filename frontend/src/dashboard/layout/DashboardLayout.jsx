// src/dashboard/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  FilePlus,
  FileSearch,
  FolderKanban,
  BarChart2,
  ListChecks,
  Menu,
  X,
  LogOut,
  Users,
} from "lucide-react";
import logo from "@/assets/logo.png";
import "@/styles/Home.css";

const SIDEBAR_ITEMS = [
  {
    section: "Dashboard Principal",
    items: [{ to: "/dashboard", label: "Pantalla Principal", icon: LayoutDashboard }],
  },
  {
    section: "Productos",
    items: [
      { to: "/dashboard/productos", label: "Gestión de Productos", icon: FileSearch },
    ],
  },
  {
    section: "Prooveedores",
    items: [
      { to: "/dashboard/proveedores", label: "Gestión de Proveedores", icon: Users },
    ],
  },
  {
    section: "Transacciones",
    items: [{ to: "/dashboard/transacciones", label: "Transacciones", icon: ClipboardList }],
  },
];

const SidebarLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200
      ${isActive ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm" : "text-gray-700 hover:bg-indigo-50 hover:shadow-sm"}`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => alert("Cerrar sesión");

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* Overlay móvil */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-md border-r flex flex-col justify-between md:static">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center py-4 border-b">
          <img src={logo} alt="V&C Corporation" className="h-16 object-contain" />
          <span className="mt-2 text-sm font-bold text-gray-700 text-center">V&C CORPORATION</span>
        </div>

        {/* Menú */}
        <nav className="flex flex-col flex-1 px-2 py-4 space-y-1">
          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section}>
              <div className="text-xs uppercase text-gray-400 font-semibold px-4 pt-5 pb-1 tracking-wide">
                {section.section}
              </div>
              {section.items.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md px-2 py-2 text-sm w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header móvil */}
        <div className="md:hidden sticky top-0 flex items-center justify-between bg-white shadow-sm px-4 py-2 z-20">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
          <span className="font-bold text-gray-800">Dashboard</span>
        </div>

        {/* Contenido */}
        <main className="flex-1 flex flex-col w-full min-h-screen bg-[#f3f4f6] overflow-x-auto">
          <div className="w-full p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
