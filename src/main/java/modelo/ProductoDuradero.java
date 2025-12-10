package modelo;

import java.io.Serializable;

/**
 * Representa productos duraderos (no perecederos).
 */
public class ProductoDuradero extends Producto implements Serializable {

    private static final long serialVersionUID = 2L;

    private String categoria;
    private int garantiaMeses;

    public ProductoDuradero() {}

    public ProductoDuradero(
            String codigo,
            String nombre,
            double precioUnitario,
            int stockActual,
            Proveedor proveedor,
            String categoria,
            int garantiaMeses
    ) {
        super(codigo, nombre, precioUnitario, stockActual, proveedor);
        this.categoria = categoria;
        this.garantiaMeses = Math.max(garantiaMeses, 0);
    }

    @Override
    public double calcularValorInventario() {
        return getPrecioUnitario() * getStockActual();
    }

    // Getters y setters
    public String getCategoria() { 
        return categoria; 
    }

    public void setCategoria(String categoria) { 
        this.categoria = categoria; 
    }

    public int getGarantiaMeses() { 
        return garantiaMeses; 
    }

    public void setGarantiaMeses(int garantiaMeses) {
        this.garantiaMeses = Math.max(garantiaMeses, 0);
    }
}

