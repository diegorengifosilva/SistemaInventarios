package persistencia;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * [IConexionDB.java]
 * Interfaz que define las operaciones básicas para la gestión de la conexión a la base de datos.
 * Esto cumple con el principio de Inversión de Dependencia (DIP) y Abstracción.
 */
public interface IConexionDB {
    
    /**
     * Establece y retorna el objeto Connection necesario para interactuar con la BD.
     * @return Objeto Connection activo.
     * @throws SQLException Si ocurre un error al conectar.
     */
    Connection conectar() throws SQLException;
    
    /**
     * Cierra la conexión a la base de datos.
     */
    void desconectar();
}