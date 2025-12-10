const API_URL = "http://localhost:8081/api/transacciones"; // Ajusta el puerto si es necesario

// Obtener todas las transacciones
export async function obtenerTransacciones() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener transacciones");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Obtener una transacción por ID
export async function obtenerTransaccion(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Transacción no encontrada");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Crear una nueva transacción
export async function crearTransaccion(transaccion) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaccion),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Filtrar transacciones por tipo o rango de fechas
export async function filtrarTransacciones({ tipo, fechaInicio, fechaFin }) {
  try {
    const params = new URLSearchParams();
    if (tipo) params.append("tipo", tipo);
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);

    const response = await fetch(`${API_URL}/filtrar?${params.toString()}`);
    if (!response.ok) throw new Error("Error al filtrar transacciones");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Obtener productos con stock bajo
export async function obtenerStockBajo(umbral = 10) {
  try {
    const response = await fetch(`${API_URL}/stock-bajo/${umbral}`);
    if (!response.ok) throw new Error("Error al obtener stock bajo");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Valor total del inventario
export async function obtenerValorTotalInventario() {
  try {
    const response = await fetch(`${API_URL}/valor-total`);
    if (!response.ok) throw new Error("Error al obtener valor total del inventario");
    return await response.json();
  } catch (error) {
    console.error(error);
    return 0;
  }
}

// Productos perecederos próximos a vencer
export async function obtenerVencimientoProximo() {
  try {
    const response = await fetch(`${API_URL}/vencimiento-proximo`);
    if (!response.ok) throw new Error("Error al obtener productos próximos a vencer");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Generar reporte (igual que filtrar)
export async function generarReporte({ tipo, fechaInicio, fechaFin }) {
  try {
    const params = new URLSearchParams();
    if (tipo) params.append("tipo", tipo);
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);

    const response = await fetch(`${API_URL}/reporte?${params.toString()}`);
    if (!response.ok) throw new Error("Error al generar reporte");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
