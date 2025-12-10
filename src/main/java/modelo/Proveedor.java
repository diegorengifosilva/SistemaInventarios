package modelo;

import java.io.Serializable;
import java.util.Objects;

/**
 * Representa a un proveedor dentro del sistema de inventario.
 * Incluye RUC, razón social y un contacto.
 */
public class Proveedor implements Serializable {

    private static final long serialVersionUID = 4L;

    private String ruc;
    private String razonSocial;
    private String contacto;

    // ─────────────────────────────────────────────
    // CONSTRUCTORES
    // ─────────────────────────────────────────────
    public Proveedor() {}

    public Proveedor(String ruc, String razonSocial, String contacto) {
        this.ruc = ruc;
        this.razonSocial = razonSocial;
        this.contacto = contacto;
    }

    // ─────────────────────────────────────────────
    // GETTERS Y SETTERS
    // ─────────────────────────────────────────────
    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }

    /**
     * Alias para compatibilidad: muchos sistemas usan "nombre".
     * Aquí representa la razón social.
     */
    public String getNombre() {
        return razonSocial;
    }

    // ─────────────────────────────────────────────
    // IGUALDAD Y HASH
    // ─────────────────────────────────────────────
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Proveedor)) return false;
        Proveedor that = (Proveedor) o;
        return Objects.equals(ruc, that.ruc);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ruc);
    }

    // ─────────────────────────────────────────────
    // REPRESENTACIÓN DE TEXTO
    // ─────────────────────────────────────────────
    @Override
    public String toString() {
        return razonSocial + " (RUC: " + ruc + ")";
    }
}
