package controlador;

import modelo.Producto;
import modelo.Proveedor;
import modelo.Transaccion;
import modelo.TipoTransaccion;
import modelo.ProductoPerecedero;
import persistencia.IInventarioDAO;
import persistencia.IProveedorDAO;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * =============================================================================
 * CONTROLADOR PRINCIPAL DEL INVENTARIO
 * - Coordina Vista ↔ Modelo ↔ DAO
 * - Aplica lógica de negocio
 * - Usa Streams & Lambdas
 * - Maneja inventario en memoria
 * - Implementa Serialización
 * =============================================================================
 */
@Component
public class InventarioController {

    private static final String ARCHIVO_CACHE = "inventario_cache.dat";

    private final IInventarioDAO inventarioDAO;
    private final IProveedorDAO proveedorDAO;

    private final Map<String, Producto> stockEnMemoria = new HashMap<>();
    private final Map<String, Proveedor> proveedoresEnMemoria = new HashMap<>();
    private final Map<Integer, Transaccion> transaccionesEnMemoria = new LinkedHashMap<>();

    public InventarioController(IInventarioDAO inventarioDAO, IProveedorDAO proveedorDAO) {
        this.inventarioDAO = inventarioDAO;
        this.proveedorDAO = proveedorDAO;
    }

    // =========================================================
    //  Inicialización del inventario y proveedores desde BD al iniciar Spring
    // =========================================================
    @PostConstruct
    public void cargarInventarioDesdeBD() {
        try {
            // Carga productos
            inventarioDAO.obtenerTodos().forEach(p -> stockEnMemoria.put(p.getCodigo(), p));
            System.out.println("✔ Inventario cargado desde la BD. Productos: " + stockEnMemoria.size());

            // Carga proveedores
            proveedorDAO.obtenerTodos().forEach(p -> proveedoresEnMemoria.put(p.getRuc(), p));
            System.out.println("✔ Proveedores cargados desde la BD. Total: " + proveedoresEnMemoria.size());

            // Carga transacciones
            inventarioDAO.obtenerTodasTransacciones().forEach(t -> transaccionesEnMemoria.put(t.getIdTransaccion(), t));
            System.out.println("✔ Transacciones cargadas desde la BD. Total: " + transaccionesEnMemoria.size());

        } catch (Exception e) {
            System.err.println("⚠ Error cargando inventario, proveedores o transacciones desde BD: " + e.getMessage());
        }
    }

    // =========================================================================
    //  SERIALIZACIÓN
    // =========================================================================
    public void guardarInventarioSerializado() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(ARCHIVO_CACHE))) {
            oos.writeObject(stockEnMemoria);
            System.out.println("✔ Inventario serializado correctamente en '" + ARCHIVO_CACHE + "'");
        } catch (IOException e) {
            System.err.println("⚠ Error al guardar inventario: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public void cargarInventarioSerializado() {
        File archivo = new File(ARCHIVO_CACHE);
        if (!archivo.exists()) return;

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(archivo))) {
            Object data = ois.readObject();
            if (data instanceof Map<?, ?> map) {
                stockEnMemoria.clear();
                stockEnMemoria.putAll((Map<String, Producto>) map);
                System.out.println("✔ Inventario cargado desde caché. Total productos: " + stockEnMemoria.size());
            }
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("⚠ No se pudo cargar la caché del inventario, creando una nueva.");
            stockEnMemoria.clear();
        }
    }

    // =========================================================================
    //  CRUD / LÓGICA DE NEGOCIO
    // =========================================================================

    // ------------------- PROVEEDORES -------------------
    public void registrarProveedor(Proveedor proveedor) {
        if (proveedor == null || proveedor.getRuc() == null || proveedor.getRuc().isBlank()) return;

        try {
            proveedorDAO.guardar(proveedor);
            proveedoresEnMemoria.put(proveedor.getRuc(), proveedor);
        } catch (Exception e) {
            System.err.println("⚠ Error al registrar proveedor: " + e.getMessage());
        }
    }

    public List<Proveedor> obtenerTodosProveedores() {
        return new ArrayList<>(proveedoresEnMemoria.values());
    }

    public Proveedor buscarProveedorPorRuc(String ruc) {
        return proveedoresEnMemoria.get(ruc);
    }

    public void eliminarProveedor(String ruc) {
        proveedoresEnMemoria.remove(ruc);
    }

    // ------------------- PRODUCTOS -------------------
    public void registrarProducto(Producto producto) {
        if (producto == null || stockEnMemoria.containsKey(producto.getCodigo())) return;
        if (producto instanceof ProductoPerecedero pp &&
            pp.getFechaVencimiento().isBefore(LocalDate.now())) return;

        try {
            inventarioDAO.guardar(producto);
            stockEnMemoria.put(producto.getCodigo(), producto);
        } catch (Exception e) {
            System.err.println("⚠ Error al registrar producto: " + e.getMessage());
        }
    }

    public void actualizarProducto(Producto producto) {
        if (producto == null || !stockEnMemoria.containsKey(producto.getCodigo())) return;

        try {
            inventarioDAO.actualizarStockDB(producto.getCodigo(), producto.getStockActual());
            stockEnMemoria.put(producto.getCodigo(), producto);
        } catch (Exception e) {
            System.err.println("⚠ Error al actualizar producto: " + e.getMessage());
        }
    }

    public void eliminarProducto(String codigo) {
        stockEnMemoria.remove(codigo);
    }

    public Producto buscarProductoPorCodigo(String codigo) {
        return stockEnMemoria.get(codigo);
    }

    // ------------------- TRANSACCIONES -------------------
    public void procesarTransaccion(Transaccion transaccion) {
        if (transaccion == null || transaccion.getProducto() == null) return;

        Producto producto = transaccion.getProducto();
        transaccion.aplicarMovimientoStock();

        try {
            inventarioDAO.actualizarStockDB(producto.getCodigo(), producto.getStockActual());
            inventarioDAO.guardarTransaccion(transaccion);  // Persistir en DB
            transaccionesEnMemoria.put(transaccion.getIdTransaccion(), transaccion);
            System.out.println("✔ Transacción procesada (ID: " + transaccion.getIdTransaccion() + ")");
        } catch (Exception e) {
            System.err.println("⚠ Error al procesar transacción: " + e.getMessage());
        }
    }

    public List<Transaccion> obtenerTodasTransacciones() {
        return new ArrayList<>(transaccionesEnMemoria.values());
    }

    public Transaccion obtenerTransaccionPorId(Integer id) {
        return transaccionesEnMemoria.get(id);
    }

    public List<Transaccion> filtrarTransacciones(TipoTransaccion tipo, String fechaInicio, String fechaFin) {
        return transaccionesEnMemoria.values().stream()
                .filter(t -> tipo == null || t.getTipo() == tipo)
                .filter(t -> {
                    if (fechaInicio == null && fechaFin == null) return true;
                    LocalDateTime inicio = (fechaInicio != null) ? LocalDateTime.parse(fechaInicio) : LocalDateTime.MIN;
                    LocalDateTime fin = (fechaFin != null) ? LocalDateTime.parse(fechaFin) : LocalDateTime.MAX;
                    return !t.getFecha().isBefore(inicio) && !t.getFecha().isAfter(fin);
                })
                .collect(Collectors.toList());
    }

    // =========================================================================
    //  MÉTODOS AUXILIARES / STREAMS
    // =========================================================================
    public double obtenerValorTotalInventario() {
        return stockEnMemoria.values().stream()
                .mapToDouble(Producto::calcularValorInventario)
                .sum();
    }

    public List<Producto> obtenerStockBajo(int umbral) {
        return stockEnMemoria.values().stream()
                .filter(p -> p.getStockActual() < umbral)
                .toList();
    }

    public List<String> obtenerNombresProductos() {
        return stockEnMemoria.values().stream()
                .map(Producto::getNombre)
                .toList();
    }

    public List<ProductoPerecedero> obtenerVencimientoProximo() {
        return stockEnMemoria.values().stream()
                .filter(ProductoPerecedero.class::isInstance)
                .map(ProductoPerecedero.class::cast)
                .filter(p -> !p.verificarVencimiento())
                .filter(p -> ChronoUnit.DAYS.between(LocalDate.now(), p.getFechaVencimiento()) <= 30)
                .toList();
    }

    public Map<String, Producto> getStockEnMemoria() {
        return Collections.unmodifiableMap(stockEnMemoria);
    }
}
