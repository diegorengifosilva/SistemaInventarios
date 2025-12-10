package modelo;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clase base para todos los productos del inventario.
 * Aplica Encapsulamiento, Herencia y Polimorfismo.
 */
public class Producto implements Serializable, IProducto {

    private static final long serialVersionUID = 1L;

    protected String codigo;
    protected String nombre;
    protected double precioUnitario;
    protected int stockActual;
    protected Proveedor proveedor;

    // 🔹 Nuevos atributos
    protected String categoria;       // ej. Hogar, Oficina, Limpieza, etc.
    protected int garantiaMeses;      // solo para productos duraderos

    /** Constructor vacío (requerido para JDBC, JSON, frameworks) */
    public Producto() {}

    /** Constructor principal */
    public Producto(String codigo, String nombre, double precioUnitario,
                    int stockActual, Proveedor proveedor) {

        this.codigo = codigo;
        this.nombre = nombre;
        this.precioUnitario = Math.max(precioUnitario, 0.0);
        this.stockActual = Math.max(stockActual, 0);
        this.proveedor = proveedor;

        this.categoria = null;
        this.garantiaMeses = 0;
    }

    /** Movimiento de stock sin permitir valores negativos */
    public void actualizarStock(int cantidad) {
        int nuevo = this.stockActual + cantidad;
        if (nuevo >= 0) {
            this.stockActual = nuevo;
        } else {
            System.err.println("Error: Stock insuficiente para el producto: " + this.nombre);
        }
    }

    // --- Getters y Setters ---
    @Override
    public String getCodigo() { return codigo; }

    @Override
    public String getNombre() { return nombre; }

    @Override
    public double getPrecioUnitario() { return precioUnitario; }

    @Override
    public int getStockActual() { return stockActual; }

    @Override
    public Proveedor getProveedor() { return proveedor; }

    @Override
    public void setStockActual(int stockActual) {
        this.stockActual = Math.max(stockActual, 0);
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = Math.max(precioUnitario, 0.0);
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    // --- Nuevos getters/setters ---
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public int getGarantiaMeses() { return garantiaMeses; }
    public void setGarantiaMeses(int garantiaMeses) {
        this.garantiaMeses = Math.max(garantiaMeses, 0);
    }

    // --- equals y hashCode basados en PK ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Producto)) return false;
        Producto producto = (Producto) o;
        return Objects.equals(codigo, producto.codigo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codigo);
    }

    /** Método de conveniencia para calcular valor total en inventario */
    public double calcularValorInventario() {
        return precioUnitario * stockActual;
    }
}
