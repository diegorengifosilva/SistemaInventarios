package modelo;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Representa una entrada o salida de stock.
 */
public class Transaccion implements Serializable {

    private static final long serialVersionUID = 5L;

    private Integer idTransaccion;            // ID auto_increment
    private TipoTransaccion tipo;             // ENTRADA / SALIDA
    private LocalDateTime fecha;
    private int cantidad;
    private Producto producto;                // Objeto producto
    private String razon;                     // Motivo de la transacción
    private String nota;                      // Comentario opcional
    private String usuario;                   // Usuario que registra la transacción
    private String idProveedor;               // Solo si tipo = ENTRADA
    private String idCliente;                 // Solo si tipo = SALIDA

    public Transaccion() {}

    public Transaccion(TipoTransaccion tipo, int cantidad, Producto producto,
                       String razon, String nota, String usuario,
                       String idProveedor, String idCliente) {
        this.tipo = tipo;
        this.fecha = LocalDateTime.now();
        this.cantidad = Math.max(cantidad, 0);
        this.producto = producto;
        this.razon = razon;
        this.nota = nota;
        this.usuario = usuario;
        this.idProveedor = idProveedor;
        this.idCliente = idCliente;
    }

    /** Aplica la entrada o salida de stock */
    public void aplicarMovimientoStock() {
        int movimiento = (tipo == TipoTransaccion.SALIDA) ? -cantidad : cantidad;
        producto.actualizarStock(movimiento);
    }

    // Getters
    public Integer getIdTransaccion() { return idTransaccion; }
    public TipoTransaccion getTipo() { return tipo; }
    public LocalDateTime getFecha() { return fecha; }
    public int getCantidad() { return cantidad; }
    public Producto getProducto() { return producto; }
    public String getRazon() { return razon; }
    public String getNota() { return nota; }
    public String getUsuario() { return usuario; }
    public String getIdProveedor() { return idProveedor; }
    public String getIdCliente() { return idCliente; }

    // Setters
    public void setIdTransaccion(Integer idTransaccion) { this.idTransaccion = idTransaccion; }
    public void setTipo(TipoTransaccion tipo) { this.tipo = tipo; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public void setRazon(String razon) { this.razon = razon; }
    public void setNota(String nota) { this.nota = nota; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public void setIdProveedor(String idProveedor) { this.idProveedor = idProveedor; }
    public void setIdCliente(String idCliente) { this.idCliente = idCliente; }
}
