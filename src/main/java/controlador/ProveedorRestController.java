// controlador/ProveedorRestController.java
package controlador;

import modelo.Proveedor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para proveedores.
 * Expone endpoints para el frontend (React).
 */
@RestController
@RequestMapping("/api/proveedores")
public class ProveedorRestController {

    private final InventarioController inventarioController;

    public ProveedorRestController(InventarioController inventarioController) {
        this.inventarioController = inventarioController;
    }

    // GET /api/proveedores → Lista de todos los proveedores
    @GetMapping
    public List<Proveedor> getTodosProveedores() {
        return inventarioController.obtenerTodosProveedores();
    }

    // GET /api/proveedores/{ruc} → Proveedor específico
    @GetMapping("/{ruc}")
    public ResponseEntity<Proveedor> getProveedor(@PathVariable String ruc) {
        Proveedor proveedor = inventarioController.obtenerTodosProveedores()
                .stream()
                .filter(p -> p.getRuc().equals(ruc))
                .findFirst()
                .orElse(null);

        if (proveedor != null) return ResponseEntity.ok(proveedor);
        return ResponseEntity.notFound().build();
    }

    // POST /api/proveedores → Crear proveedor
    @PostMapping
    public ResponseEntity<String> crearProveedor(@RequestBody Proveedor proveedor) {
        inventarioController.registrarProveedor(proveedor);
        return ResponseEntity.ok("Proveedor registrado correctamente");
    }

    // PUT /api/proveedores/{ruc} → Actualizar proveedor
    @PutMapping("/{ruc}")
    public ResponseEntity<String> actualizarProveedor(
            @PathVariable String ruc,
            @RequestBody Proveedor proveedorActualizado) {

        List<Proveedor> proveedores = inventarioController.obtenerTodosProveedores();
        Proveedor existente = proveedores.stream()
                .filter(p -> p.getRuc().equals(ruc))
                .findFirst()
                .orElse(null);

        if (existente == null) return ResponseEntity.notFound().build();

        existente.setRazonSocial(proveedorActualizado.getRazonSocial());
        existente.setContacto(proveedorActualizado.getContacto());
        // No necesitamos llamar a DAO directamente, InventarioController maneja persistencia
        inventarioController.registrarProveedor(existente);

        return ResponseEntity.ok("Proveedor actualizado correctamente");
    }

    // DELETE /api/proveedores/{ruc} → Eliminar proveedor
    @DeleteMapping("/{ruc}")
    public ResponseEntity<String> eliminarProveedor(@PathVariable String ruc) {
        List<Proveedor> proveedores = inventarioController.obtenerTodosProveedores();
        Proveedor existente = proveedores.stream()
                .filter(p -> p.getRuc().equals(ruc))
                .findFirst()
                .orElse(null);

        if (existente == null) return ResponseEntity.notFound().build();

        proveedores.remove(existente); // se quita de la lista en memoria
        return ResponseEntity.ok("Proveedor eliminado correctamente");
    }
}
