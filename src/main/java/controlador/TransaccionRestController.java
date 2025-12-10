// controlador/TransaccionRestController.java
package controlador;

import modelo.Transaccion;
import modelo.Producto;
import modelo.TipoTransaccion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para transacciones.
 * Maneja movimientos de stock: entradas y salidas.
 */
@RestController
@RequestMapping("/api/transacciones")
public class TransaccionRestController {

    private final InventarioController inventarioController;

    public TransaccionRestController(InventarioController inventarioController) {
        this.inventarioController = inventarioController;
    }

    // POST /api/transacciones → Registrar una transacción
    @PostMapping
    public ResponseEntity<String> crearTransaccion(@RequestBody Transaccion transaccion) {
        Producto producto = transaccion.getProducto();

        if (producto == null || inventarioController.buscarProductoPorCodigo(producto.getCodigo()) == null) {
            return ResponseEntity.badRequest().body("Producto no existe o transacción inválida");
        }

        inventarioController.procesarTransaccion(transaccion);
        return ResponseEntity.ok("Transacción procesada correctamente");
    }

    // GET /api/transacciones → Obtener historial completo de transacciones
    @GetMapping
    public List<Transaccion> obtenerTodasTransacciones() {
        return inventarioController.obtenerTodasTransacciones();
    }   

    // GET /api/transacciones/{id} → Detalle de una transacción
    @GetMapping("/{id}")
    public ResponseEntity<Transaccion> obtenerTransaccion(@PathVariable Integer id) {
        Transaccion t = inventarioController.obtenerTransaccionPorId(id);
        return t != null ? ResponseEntity.ok(t) : ResponseEntity.notFound().build();
    }


    // GET /api/transacciones/filtrar → Filtrar por tipo o rango de fechas
    @GetMapping("/filtrar")
    public List<Transaccion> filtrarTransacciones(
            @RequestParam(required = false) TipoTransaccion tipo,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin) {
        return inventarioController.filtrarTransacciones(tipo, fechaInicio, fechaFin);
    }

    // GET /api/transacciones/stock-bajo/{umbral} → Productos con stock bajo
    @GetMapping("/stock-bajo/{umbral}")
    public List<Producto> obtenerStockBajo(@PathVariable int umbral) {
        return inventarioController.obtenerStockBajo(umbral);
    }

    // GET /api/transacciones/valor-total → Valor total del inventario
    @GetMapping("/valor-total")
    public double obtenerValorTotalInventario() {
        return inventarioController.obtenerValorTotalInventario();
    }

    // GET /api/transacciones/vencimiento-proximo → Productos perecederos próximos a vencer
    @GetMapping("/vencimiento-proximo")
    public List<Producto> obtenerVencimientoProximo() {
        return List.copyOf(inventarioController.getStockEnMemoria().values().stream()
                .filter(p -> p instanceof modelo.ProductoPerecedero)
                .map(p -> (modelo.ProductoPerecedero) p)
                .filter(p -> !p.verificarVencimiento())
                .toList());
    }

    // GET /api/transacciones/reporte → Generar reporte (igual que filtrar)
    @GetMapping("/reporte")
    public List<Transaccion> generarReporte(
            @RequestParam(required = false) TipoTransaccion tipo,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin) {
        return inventarioController.filtrarTransacciones(tipo, fechaInicio, fechaFin);
    }
}
