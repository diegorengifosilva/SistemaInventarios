package persistencia;

import modelo.Proveedor;
import java.sql.SQLException; // Import necesario
import java.util.List;

/**
 * [IProveedorDAO.java]
 * Interfaz del Objeto de Acceso a Datos (DAO) para la entidad Proveedor.
 * Define las operaciones de persistencia.
 */
public interface IProveedorDAO {
    
    /**
     * Guarda (inserta) un objeto Proveedor en la base de datos.
     * @param proveedor El objeto Proveedor a persistir.
     */
    void guardar(Proveedor proveedor) throws SQLException; // 💡 MEJORA: Declara excepción
    
    /**
     * Recupera un Proveedor de la base de datos utilizando su RUC (PK).
     * @param ruc La clave primaria del proveedor.
     * @return El objeto Proveedor si se encuentra, o null.
     */
    Proveedor obtenerPorRuc(String ruc) throws SQLException; // 💡 MEJORA: Nuevo método de consulta
    
    /**
     * Recupera todos los proveedores registrados.
     * @return Una lista (List) de objetos Proveedor.
     */
    List<Proveedor> obtenerTodos() throws SQLException; // 💡 MEJORA: Nuevo método para listar
}