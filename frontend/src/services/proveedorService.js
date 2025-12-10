const API_URL = "http://localhost:8081/api/proveedores"; // Ajusta el puerto si es necesario

// Obtener todos los proveedores
export async function obtenerProveedores() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener proveedores");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Crear un proveedor
export async function crearProveedor(proveedor) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Actualizar un proveedor por RUC
export async function actualizarProveedor(ruc, proveedor) {
  try {
    const response = await fetch(`${API_URL}/${ruc}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Eliminar un proveedor por RUC
export async function eliminarProveedor(ruc) {
  try {
    const response = await fetch(`${API_URL}/${ruc}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
