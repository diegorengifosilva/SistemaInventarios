// src/dashboard/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSearch,
  ClipboardList,
  FilePlus,
  Users,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "@/assets/logo.png";

const SIDEBAR_ITEMS = [
  {
    section: "Dashboard Principal",
    items: [{ to: "/dashboard", label: "Pantalla Principal", icon: LayoutDashboard }],
  },
  {
    section: "Productos",
    items: [{ to: "/dashboard/productos", label: "Gestión de Productos", icon: FileSearch }],
  },
  {
    section: "Proveedores",
    items: [{ to: "/dashboard/proveedores", label: "Gestión de Proveedores", icon: Users }],
  },
  {
    section: "Transacciones",
    items: [{ to: "/dashboard/transacciones", label: "Transacciones", icon: ClipboardList }],
  },
];

const NavSectionTitle = ({ title }) => (
  <div className="text-xs uppercase text-gray-400 font-semibold px-4 pt-5 pb-1 tracking-wide">
    {title}
  </div>
);

const SidebarLink = ({ to, label, icon: Icon, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`relative flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200
        ${isActive
          ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
          : "text-gray-700 hover:bg-indigo-50 hover:shadow-sm"
        }`}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-auto">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => alert("Cerrar sesión");

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] relative">

      {/* Overlay móvil */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-screen
          bg-white/90 backdrop-blur-md border-r shadow-md
          flex flex-col justify-between transform transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          ${sidebarOpen ? "md:w-64" : "md:w-20"} md:translate-x-0`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Logo y toggle */}
        <div className="flex flex-col items-center justify-center py-4 border-b relative group">
          <img
            src={logo}
            alt="V&C Corporation"
            className={`transition-all duration-300 ${sidebarOpen ? "h-16" : "h-12"} group-hover:scale-105`}
          />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden md:flex absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-opacity duration-200
            ${hovered ? "opacity-100" : "opacity-0"}`}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Menú */}
        <nav className="flex flex-col flex-1 px-2 py-4 space-y-1">
          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section}>
              {sidebarOpen && <NavSectionTitle title={section.section} />}
              {section.items.map((item) => (
                <SidebarLink key={item.to} {...item} collapsed={!sidebarOpen} />
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
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Header móvil */}
        <div className="md:hidden sticky top-0 flex items-center justify-between bg-white/90 shadow-sm px-4 py-2 backdrop-blur-sm z-20">
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
