import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Tippy from "@tippyjs/react";
import { Info } from "lucide-react";
import "tippy.js/dist/tippy.css";

/* ==========================================================
   📊 KpiCard — Tarjeta Corporativa de Indicadores (PMInsight)
   ========================================================== */

const KpiCard = ({
  label,
  value,
  gradient = "linear-gradient(135deg,#2563eb,#3b82f6)",
  icon: Icon,
  tooltip,
  decimals = 0,
  compact = false,
  align = "center", // center | left
}) => {
  /* Tamaños responsables y fluidos */
  const padding = compact ? "p-[clamp(6px,1vw,10px)]" : "p-[clamp(12px,2vw,18px)]";
  const minHeight = compact
    ? "min-h-[clamp(70px,8vw,90px)]"
    : "min-h-[clamp(100px,10vw,130px)]";

  const iconSize = compact ? "clamp(18px,4vw,22px)" : "clamp(22px,5vw,28px)";
  const labelSize = compact ? "clamp(0.7rem,1.5vw,0.9rem)" : "clamp(0.85rem,1.8vw,1rem)";
  const valueSize = compact
    ? "clamp(1rem,3vw,1.35rem)"
    : "clamp(1.35rem,4vw,1.85rem)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={`w-full rounded-2xl relative cursor-pointer select-none overflow-hidden 
        flex flex-col ${align === "center" ? "items-center text-center" : "sm:flex-row items-start text-left"} 
        justify-center text-white ${padding} ${minHeight}
      `}
      style={{
        background: gradient,
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        transition: "var(--transition-base)",
      }}
      aria-label={`${label}: ${value}`}
    >
      {/* 🎇 Efecto de brillo al pasar hover */}
      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      {/* ℹ Tooltip */}
      {tooltip && (
        <div className="absolute top-2 right-2">
          <Tippy content={tooltip} delay={100}>
            <button
              aria-label="Información"
              className="text-white opacity-90 hover:opacity-100 transition-opacity"
            >
              <Info size={compact ? 13 : 15} />
            </button>
          </Tippy>
        </div>
      )}

      {/* Contenido principal */}
      <div className={`flex ${align === "center" ? "flex-col items-center" : "flex-row items-center gap-2"}`}>
        {/* Icono */}
        {Icon && (
          <Icon
            className="opacity-95 drop-shadow-sm"
            style={{ width: iconSize, height: iconSize }}
          />
        )}

        {/* Texto */}
        <div className={align === "left" ? "flex flex-col" : ""}>
          <p className={`opacity-90 font-medium truncate ${labelSize}`}>
            {label}
          </p>

          <p className={`font-bold leading-tight drop-shadow-sm ${valueSize}`}>
            <CountUp
              end={Math.max(0, Number(value))}
              duration={1.1}
              separator=","
              decimals={decimals}
            />
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;
