package controlador;

import modelo.Producto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para productos.
 * Expone endpoints para el frontend (React).
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {

    private final InventarioController inventarioController;

    public ProductoRestController(InventarioController inventarioController) {
        this.inventarioController = inventarioController;
    }

    // GET /api/productos → Lista de productos
    @GetMapping
    public ResponseEntity<List<Producto>> getTodosProductos() {
        List<Producto> productos = inventarioController.getStockEnMemoria().values().stream().toList();
        return ResponseEntity.ok(productos);
    }

    // GET /api/productos/{codigo} → Producto específico
    @GetMapping("/{codigo}")
    public ResponseEntity<Producto> getProducto(@PathVariable String codigo) {
        Producto producto = inventarioController.buscarProductoPorCodigo(codigo);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // POST /api/productos → Crear producto
    @PostMapping
    public ResponseEntity<String> crearProducto(@RequestBody Producto producto) {
        if (producto == null || producto.getCodigo() == null || producto.getCodigo().isBlank()) {
            return ResponseEntity.badRequest().body("Código de producto obligatorio");
        }

        if (inventarioController.buscarProductoPorCodigo(producto.getCodigo()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Código de producto ya existe");
        }

        inventarioController.registrarProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Producto creado correctamente");
    }

    // PUT /api/productos/{codigo} → Actualizar producto
    @PutMapping("/{codigo}")
    public ResponseEntity<String> actualizarProducto(
            @PathVariable String codigo,
            @RequestBody Producto productoActualizado) {

        Producto existente = inventarioController.buscarProductoPorCodigo(codigo);
        if (existente == null) return ResponseEntity.notFound().build();

        // Actualiza campos permitidos
        existente.setNombre(productoActualizado.getNombre());
        existente.setPrecioUnitario(productoActualizado.getPrecioUnitario());
        existente.setStockActual(productoActualizado.getStockActual());
        // Si quieres actualizar proveedor, tipo, etc., agrega aquí

        // Llamar método específico de actualización (no registrarProducto)
        inventarioController.actualizarProducto(existente);
        return ResponseEntity.ok("Producto actualizado correctamente");
    }

    // DELETE /api/productos/{codigo} → Eliminar producto
    @DeleteMapping("/{codigo}")
    public ResponseEntity<String> eliminarProducto(@PathVariable String codigo) {
        Producto producto = inventarioController.buscarProductoPorCodigo(codigo);
        if (producto == null) return ResponseEntity.notFound().build();

        inventarioController.eliminarProducto(codigo);
        return ResponseEntity.ok("Producto eliminado correctamente");
    }
}
