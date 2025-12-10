const API_URL = "http://localhost:8081/api/productos"; // Ajusta el puerto si es necesario

export async function obtenerProductos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function crearProducto(producto) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function actualizarProducto(codigo, producto) {
  try {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function eliminarProducto(codigo) {
  try {
    const response = await fetch(`${API_URL}/${codigo}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
