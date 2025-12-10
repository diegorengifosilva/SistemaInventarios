package modelo;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Representa productos perecederos con fecha de vencimiento.
 */
public class ProductoPerecedero extends Producto implements Serializable {

    private static final long serialVersionUID = 3L;

    private LocalDate fechaVencimiento;
    private boolean requiereRefrigeracion;

    public ProductoPerecedero() {}

    public ProductoPerecedero(String codigo, String nombre, double precioUnitario,
                              int stockActual, Proveedor proveedor,
                              LocalDate fechaVencimiento, boolean requiereRefrigeracion) {
        super(codigo, nombre, precioUnitario, stockActual, proveedor);
        this.fechaVencimiento = fechaVencimiento;
        this.requiereRefrigeracion = requiereRefrigeracion;
    }

    @Override
    public double calcularValorInventario() {
        return verificarVencimiento() ? 0.0 : getPrecioUnitario() * getStockActual();
    }

    /** Devuelve true si el producto ya venció */
    public boolean verificarVencimiento() {
        return fechaVencimiento != null && LocalDate.now().isAfter(fechaVencimiento);
    }

    // Getters y Setters
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }

    public boolean isRequiereRefrigeracion() { return requiereRefrigeracion; }
    public void setRequiereRefrigeracion(boolean requiereRefrigeracion) { this.requiereRefrigeracion = requiereRefrigeracion; }
}
