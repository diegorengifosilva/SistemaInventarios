package persistencia;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * [ConexionDBMySQL.java]
 * Implementación concreta de IConexionDB.
 * Maneja la conexión a MySQL usando JDBC.
 *
 * Cumple con:
 * - Principio DIP (se usa la interfaz IConexionDB)
 * - SRP (solo gestiona conexiones)
 * - Alta cohesión y bajo acoplamiento
 */
public class ConexionDBMySQL implements IConexionDB {

    // Parámetros de conexión
    private final String url;
    private final String usuario;
    private final String clave;

    private Connection conexion;

    /**
     * Constructor principal que recibe todos los parámetros.
     *
     * @param url     Dirección JDBC de la base de datos.
     * @param usuario Usuario de acceso.
     * @param clave   Contraseña.
     */
    public ConexionDBMySQL(String url, String usuario, String clave) {
        this.url = url;
        this.usuario = usuario;
        this.clave = clave;
    }

    /**
     * ✔️ Constructor por defecto.
     * Facilita la creación rápida sin repetir credenciales en el Main.
     * Puedes editar estos valores según tu BD local.
     */
    public ConexionDBMySQL() {
        this(
            "jdbc:mysql://localhost:3306/inventario",  // BD por defecto
            "root",                                     // Usuario por defecto
            ""                                           // Contraseña vacía (XAMPP)
        );
    }

    @Override
    public Connection conectar() throws SQLException {

        // Reutilizar conexión abierta
        if (conexion != null && !conexion.isClosed()) {
            return conexion;
        }

        try {
            // Cargar driver explícitamente (buena práctica)
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("❌ No se encontró el driver MySQL: " + e.getMessage());
        }

        conexion = DriverManager.getConnection(url, usuario, clave);
        return conexion;
    }

    @Override
    public void desconectar() {
        try {
            if (conexion != null && !conexion.isClosed()) {
                conexion.close();
                conexion = null;
            }
        } catch (SQLException e) {
            System.err.println("⚠️ Error al cerrar la conexión: " + e.getMessage());
        }
    }
}
