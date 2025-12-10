package persistencia;

import modelo.Producto;
import modelo.Transaccion;

import java.util.List;

/**
 * [IInventarioDAO.java]
 * Interfaz del Objeto de Acceso a Datos (DAO) para la entidad Producto y Transaccion.
 * Define las operaciones de persistencia sin especificar cómo se implementan.
 */
public interface IInventarioDAO {
    
    // ==========================
    // PRODUCTOS
    // ==========================
    void guardar(Producto producto);

    Producto obtenerPorCodigo(String codigo);

    void actualizarStockDB(String codigo, int cantidad);

    List<Producto> obtenerTodos();

    // ==========================
    // TRANSACCIONES
    // ==========================
    /**
     * Guarda una transacción de inventario (entrada o salida) en la BD.
     * @param transaccion La transacción a persistir.
     * @throws Exception En caso de error al guardar.
     */
    void guardarTransaccion(Transaccion transaccion) throws Exception;

    /**
     * Recupera todas las transacciones de inventario de la BD.
     * @return Lista de transacciones.
     * @throws Exception En caso de error al consultar.
     */
    List<Transaccion> obtenerTodasTransacciones() throws Exception;
}
