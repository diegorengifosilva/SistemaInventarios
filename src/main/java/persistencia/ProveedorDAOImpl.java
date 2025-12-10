package persistencia;

import modelo.Proveedor;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementación del DAO para la entidad Proveedor.
 * Cumple el patrón DAO y separa la lógica de persistencia de la lógica de negocio.
 */
public class ProveedorDAOImpl implements IProveedorDAO {

    // Dependencia inyectada (No acoplamiento a una implementación concreta)
    private IConexionDB conexionDB;

    public ProveedorDAOImpl(IConexionDB conexionDB) {
        this.conexionDB = conexionDB;
    }

    /**
     * Inserta un proveedor en la base de datos.
     */
    @Override
    public void guardar(Proveedor proveedor) {
        String sql = "INSERT INTO proveedor (ruc, razon_social, contacto) VALUES (?, ?, ?)";

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, proveedor.getRuc());
            ps.setString(2, proveedor.getRazonSocial());
            ps.setString(3, proveedor.getContacto());

            ps.executeUpdate();

        } catch (SQLException e) {
            // El proveedor puede existir si se ejecuta varias veces
            System.out.println("ADVERTENCIA: No se pudo guardar proveedor (" 
                    + proveedor.getRuc() + "): " + e.getMessage());
        }
    }

    /**
     * Obtiene un proveedor por su RUC.
     * Retorna null si no existe.
     */
    @Override
    public Proveedor obtenerPorRuc(String ruc) throws SQLException {

        String sql = "SELECT ruc, razon_social, contacto FROM proveedor WHERE ruc = ?";

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, ruc);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Proveedor(
                        rs.getString("ruc"),
                        rs.getString("razon_social"),
                        rs.getString("contacto")
                    );
                }
            }
        }

        return null;
    }

    /**
     * Obtiene la lista completa de proveedores registrados.
     */
    @Override
    public List<Proveedor> obtenerTodos() throws SQLException {

        List<Proveedor> proveedores = new ArrayList<>();

        String sql = "SELECT ruc, razon_social, contacto FROM proveedor";

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Proveedor p = new Proveedor(
                    rs.getString("ruc"),
                    rs.getString("razon_social"),
                    rs.getString("contacto")
                );
                proveedores.add(p);
            }
        }

        return proveedores;
    }
}
