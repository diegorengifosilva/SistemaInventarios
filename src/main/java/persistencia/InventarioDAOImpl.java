package persistencia;

import modelo.Producto;
import modelo.ProductoPerecedero;
import modelo.Proveedor;
import modelo.Transaccion;
import modelo.TipoTransaccion;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * [InventarioDAOImpl.java]
 * Implementación concreta del IInventarioDAO.
 * Maneja la persistencia real usando JDBC con MySQL.
 */
public class InventarioDAOImpl implements IInventarioDAO {

    private final IConexionDB conexionDB;

    public InventarioDAOImpl(IConexionDB conexionDB) {
        this.conexionDB = conexionDB;
    }

    // ----------------------------------------------------------------------
    //  INSERTAR PRODUCTO
    // ----------------------------------------------------------------------
    @Override
    public void guardar(Producto producto) {
        if (producto == null) {
            throw new IllegalArgumentException("El producto no puede ser null");
        }

        if (producto.getProveedor() == null || producto.getProveedor().getRuc() == null) {
            throw new IllegalArgumentException("El producto debe tener un proveedor válido");
        }

        String sql = """
                INSERT INTO producto (
                    codigo, nombre, precio, stock_actual, ruc_proveedor,
                    tipo_producto, fecha_vencimiento, requiere_refrigeracion,
                    categoria, garantia_meses
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            boolean autoCommitOriginal = conn.getAutoCommit();
            conn.setAutoCommit(false);

            ps.setString(1, producto.getCodigo());
            ps.setString(2, producto.getNombre());
            ps.setDouble(3, producto.getPrecioUnitario());
            ps.setInt(4, producto.getStockActual());
            ps.setString(5, producto.getProveedor().getRuc());

            if (producto instanceof ProductoPerecedero pp) {
                ps.setString(6, "perecedero");
                ps.setDate(7, Date.valueOf(pp.getFechaVencimiento()));
                ps.setBoolean(8, pp.isRequiereRefrigeracion());
            } else {
                ps.setString(6, "duradero");
                ps.setNull(7, Types.DATE);
                ps.setNull(8, Types.BOOLEAN);
            }

            ps.setString(9, producto.getCategoria());
            ps.setInt(10, producto.getGarantiaMeses());

            ps.executeUpdate();
            conn.commit();
            conn.setAutoCommit(autoCommitOriginal);
            System.out.println("✔ Producto guardado correctamente: " + producto.getCodigo());

        } catch (SQLException e) {
            System.err.println("❌ Error al guardar producto: " + e.getMessage());
        }
    }

    // ----------------------------------------------------------------------
    //  BUSCAR POR CÓDIGO
    // ----------------------------------------------------------------------
    @Override
    public Producto obtenerPorCodigo(String codigo) {
        if (codigo == null) return null;

        String sql = """
                SELECT p.codigo, p.nombre, p.precio, p.stock_actual,
                       p.tipo_producto, p.fecha_vencimiento, p.requiere_refrigeracion,
                       p.categoria, p.garantia_meses,
                       prov.ruc, prov.razon_social AS nombre_prov
                FROM producto p
                INNER JOIN proveedor prov ON p.ruc_proveedor = prov.ruc
                WHERE p.codigo = ?
                """;

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, codigo);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return null;

                Proveedor proveedor = new Proveedor(
                        rs.getString("ruc"),
                        rs.getString("nombre_prov"),
                        ""
                );

                Producto prod;
                String tipo = rs.getString("tipo_producto");
                LocalDate fechaV = rs.getDate("fecha_vencimiento") != null
                        ? rs.getDate("fecha_vencimiento").toLocalDate()
                        : null;
                boolean requiereRef = rs.getBoolean("requiere_refrigeracion");

                if ("perecedero".equalsIgnoreCase(tipo)) {
                    prod = new ProductoPerecedero(
                            rs.getString("codigo"),
                            rs.getString("nombre"),
                            rs.getDouble("precio"),
                            rs.getInt("stock_actual"),
                            proveedor,
                            fechaV,
                            requiereRef
                    );
                } else {
                    prod = new Producto(
                            rs.getString("codigo"),
                            rs.getString("nombre"),
                            rs.getDouble("precio"),
                            rs.getInt("stock_actual"),
                            proveedor
                    );
                }

                prod.setCategoria(rs.getString("categoria"));
                prod.setGarantiaMeses(rs.getInt("garantia_meses"));
                return prod;
            }

        } catch (SQLException e) {
            System.err.println("❌ Error al obtener producto por código: " + e.getMessage());
            return null;
        }
    }

    // ----------------------------------------------------------------------
    //  ACTUALIZAR STOCK
    // ----------------------------------------------------------------------
    @Override
    public void actualizarStockDB(String codigo, int cantidad) {
        if (codigo == null) return;

        String sql = "UPDATE producto SET stock_actual = ? WHERE codigo = ?";

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, cantidad);
            ps.setString(2, codigo);
            ps.executeUpdate();

        } catch (SQLException e) {
            System.err.println("❌ Error al actualizar stock: " + e.getMessage());
        }
    }

    // ----------------------------------------------------------------------
    //  OBTENER TODOS
    // ----------------------------------------------------------------------
    @Override
    public List<Producto> obtenerTodos() {
        List<Producto> lista = new ArrayList<>();
        String sql = """
                SELECT p.codigo, p.nombre, p.precio, p.stock_actual,
                       p.tipo_producto, p.fecha_vencimiento, p.requiere_refrigeracion,
                       p.categoria, p.garantia_meses,
                       prov.ruc, prov.razon_social AS nombre_prov
                FROM producto p
                INNER JOIN proveedor prov ON p.ruc_proveedor = prov.ruc
                """;

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Proveedor proveedor = new Proveedor(
                        rs.getString("ruc"),
                        rs.getString("nombre_prov"),
                        ""
                );

                Producto prod;
                String tipo = rs.getString("tipo_producto");
                LocalDate fechaV = rs.getDate("fecha_vencimiento") != null
                        ? rs.getDate("fecha_vencimiento").toLocalDate()
                        : null;
                boolean requiereRef = rs.getBoolean("requiere_refrigeracion");

                if ("perecedero".equalsIgnoreCase(tipo)) {
                    prod = new ProductoPerecedero(
                            rs.getString("codigo"),
                            rs.getString("nombre"),
                            rs.getDouble("precio"),
                            rs.getInt("stock_actual"),
                            proveedor,
                            fechaV,
                            requiereRef
                    );
                } else {
                    prod = new Producto(
                            rs.getString("codigo"),
                            rs.getString("nombre"),
                            rs.getDouble("precio"),
                            rs.getInt("stock_actual"),
                            proveedor
                    );
                }

                prod.setCategoria(rs.getString("categoria"));
                prod.setGarantiaMeses(rs.getInt("garantia_meses"));

                lista.add(prod);
            }

        } catch (SQLException e) {
            System.err.println("❌ Error al obtener todos los productos: " + e.getMessage());
        }

        return lista;
    }

    // ----------------------------------------------------------------------
    //  NUEVOS MÉTODOS: TRANSACCIONES
    // ----------------------------------------------------------------------
    @Override
    public void guardarTransaccion(Transaccion transaccion) throws Exception {
        if (transaccion == null || transaccion.getProducto() == null) {
            throw new IllegalArgumentException("Transacción inválida");
        }

        String sql = """
                INSERT INTO transaccion (
                    tipo, cantidad, codigo_producto, fecha, razon, nota,
                    usuario, id_proveedor, id_cliente
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conn = conexionDB.conectar();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, transaccion.getTipo().name());
            ps.setInt(2, transaccion.getCantidad());
            ps.setString(3, transaccion.getProducto().getCodigo());
            ps.setTimestamp(4, Timestamp.valueOf(transaccion.getFecha()));
            ps.setString(5, transaccion.getRazon() != null ? transaccion.getRazon() : "");
            ps.setString(6, transaccion.getNota() != null ? transaccion.getNota() : "");
            ps.setString(7, transaccion.getUsuario() != null ? transaccion.getUsuario() : "");
            ps.setString(8, transaccion.getIdProveedor() != null ? transaccion.getIdProveedor() : null);
            ps.setString(9, transaccion.getIdCliente() != null ? transaccion.getIdCliente() : null);

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    // Guardar directamente como Integer
                    transaccion.setIdTransaccion(rs.getInt(1));
                }
            }

            System.out.println("✔ Transacción guardada: " + transaccion.getIdTransaccion());

        } catch (SQLException e) {
            System.err.println("❌ Error al guardar transacción: " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<Transaccion> obtenerTodasTransacciones() throws Exception {
        List<Transaccion> lista = new ArrayList<>();

        // Cargar todos los productos primero
        List<Producto> productos = obtenerTodos();
        Map<String, Producto> mapaProductos = productos.stream()
                .collect(Collectors.toMap(Producto::getCodigo, p -> p));

        String sql = "SELECT * FROM transaccion";

        try (Connection conn = conexionDB.conectar();
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Producto producto = mapaProductos.get(rs.getString("codigo_producto"));
                if (producto == null) continue;

                Transaccion t = new Transaccion();
                t.setIdTransaccion(rs.getInt("id_transaccion"));
                t.setTipo(TipoTransaccion.valueOf(rs.getString("tipo")));
                t.setFecha(rs.getTimestamp("fecha").toLocalDateTime());
                t.setCantidad(rs.getInt("cantidad"));
                t.setProducto(producto);
                t.setRazon(rs.getString("razon"));
                t.setNota(rs.getString("nota"));
                t.setUsuario(rs.getString("usuario"));
                t.setIdProveedor(rs.getString("id_proveedor"));
                t.setIdCliente(rs.getString("id_cliente"));

                lista.add(t);
            }

        } catch (SQLException e) {
            System.err.println("❌ Error al obtener transacciones: " + e.getMessage());
            throw e;
        }

        return lista;
    }

}
