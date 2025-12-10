package modelo;

public interface IProducto {
    String getCodigo();
    String getNombre();
    double getPrecioUnitario();
    int getStockActual();
    Proveedor getProveedor();

    void setStockActual(int stock);
    double calcularValorInventario();
}
