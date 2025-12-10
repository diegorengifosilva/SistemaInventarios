import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Table = ({
  headers = [],
  data = [],
  renderRow,
  emptyMessage = "No hay datos disponibles.",
  activeRow = null,
  rowsPerPage = 10,
  onRowClick,
  fetchData,
  titulo,
  compact = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (fetchData) handleReload({ index: page });
  };

  const handleReload = async (params = {}) => {
    if (!fetchData) return;
    setLoading(true);
    try {
      await fetchData(params);
    } catch (err) {
      console.error("Error recargando tabla:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const textSizeClass = compact
    ? "text-[clamp(10px,1.8vw,12px)]"
    : "text-[clamp(12px,1.2vw,14px)]";
  const cellPaddingClass = compact
    ? "px-[clamp(4px,1vw,6px)] py-[clamp(2px,0.5vw,4px)]"
    : "px-[clamp(8px,2vw,16px)] py-[clamp(6px,1vw,10px)]";
  const cardPaddingClass = compact ? "p-[clamp(4px,1vw,6px)]" : "p-3 md:p-4";

  // Función segura para obtener los datos de la fila
  const safeRenderRow = (item) => {
    if (typeof renderRow === "function") {
      const result = renderRow(item);
      return Array.isArray(result) ? result : [result];
    }
    // Fallback: si no hay renderRow, muestra los valores del objeto
    return Object.values(item);
  };

  return (
    <div className="relative w-full flex flex-col overflow-hidden">
      {/* === TITULO === */}
      {titulo && (
        <div className="w-full px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-between rounded-t-2xl">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg truncate">
            {titulo}
          </h3>
        </div>
      )}

      {/* === DESKTOP TABLE === */}
      <div className="hidden md:block w-full flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600/50 dark:scrollbar-track-gray-800">
        <table className="w-full border-collapse min-w-[720px] text-gray-800 dark:text-gray-100 rounded-2xl">
          {/* === ENCABEZADO === */}
          <thead className="sticky top-0 z-10 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 shadow-[0_2px_6px_rgba(0,0,0,0.05)] border-b border-gray-200 dark:border-gray-700">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`${cellPaddingClass} text-center align-middle text-sm font-semibold uppercase tracking-wide
                    ${idx === 0 ? "rounded-tl-2xl" : ""} 
                    ${idx === headers.length - 1 ? "rounded-tr-2xl" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* === CUERPO DE LA TABLA === */}
          <tbody className="bg-white dark:bg-gray-900 text-xs divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIndex) => {
                const rowData = safeRenderRow(item);
                return (
                  <tr
                    key={rowIndex}
                    className={`transition-colors duration-200 ease-out cursor-pointer select-none text-center
                      ${activeRow === (item.id || rowIndex)
                        ? "bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-400 dark:ring-blue-600"
                        : "hover:bg-blue-100/90 dark:hover:bg-blue-700/40"
                      }`}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {rowData.map((cell, i) => {
                      const isLastRow = rowIndex === paginatedData.length - 1;
                      return (
                        <td
                          key={i}
                          className={`${cellPaddingClass} align-middle break-words max-w-[220px] text-center ${
                            isLastRow && i === 0 ? "rounded-bl-2xl" : ""
                          } ${isLastRow && i === headers.length - 1 ? "rounded-br-2xl" : ""}`}
                        >
                          {typeof cell === "string" || typeof cell === "number" ? (
                            <Tippy content={cell}>
                              <span
                                className="block truncate cursor-text select-text"
                                onClick={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {cell}
                              </span>
                            </Tippy>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onDoubleClick={(e) => e.stopPropagation()}
                              className="w-full h-full"
                            >
                              {cell}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* === MOBILE VIEW === */}
      <div className="flex flex-col gap-[clamp(8px,1.2vw,12px)] md:hidden p-2 sm:p-3">
        {paginatedData.length === 0 ? (
          <div className="px-4 py-5 text-center text-gray-500 italic bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
            {emptyMessage}
          </div>
        ) : (
          paginatedData.map((item, index) => {
            const rowData = safeRenderRow(item);
            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 ${cardPaddingClass} shadow-lg hover:shadow-xl transition-all duration-300 ease-out cursor-pointer
                  ${
                    activeRow === (item.id || index)
                      ? "ring-2 ring-blue-500 dark:ring-blue-600 bg-blue-100/70 dark:bg-blue-900/40"
                      : "hover:bg-blue-200/50 dark:hover:bg-blue-900/30"
                  }`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {/* === CARD HEADER === */}
                <div className="pb-2 mb-2 border-b border-gray-200 dark:border-gray-700">
                  <h5 className="text-gray-800 dark:text-gray-100 font-semibold text-[clamp(12px,2vw,14px)] truncate">
                    {titulo || `Registro ${index + 1}`}
                  </h5>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    {paginatedData.length} / {data.length} registros
                  </span>
                </div>

                {/* === CARD CONTENT === */}
                {headers.map((header, i) => {
                  const cell = rowData[i] ?? "-";
                  const isActionButton = typeof cell === "object" && cell?.type?.name === "Button";

                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center py-[clamp(4px,0.8vw,6px)]"
                    >
                      <span className="font-semibold text-gray-600 dark:text-gray-300 text-[clamp(10px,2vw,12px)] uppercase tracking-wide w-[42%]">
                        {header}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 text-[clamp(11px,2vw,13px)] text-center break-words w-[58%]">
                        {!isActionButton ? (
                          typeof cell === "string" || typeof cell === "number" ? (
                            <Tippy content={cell}>
                              <span
                                className="block truncate cursor-text select-text"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {cell}
                              </span>
                            </Tippy>
                          ) : (
                            cell
                          )
                        ) : null}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            );
          })
        )}
      </div>

      {/* === PAGINACIÓN === */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </Button>
        </div>
      )}

      {/* === ESTADO DE CARGA === */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl z-20">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <span className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
            <span className="font-medium text-sm">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
