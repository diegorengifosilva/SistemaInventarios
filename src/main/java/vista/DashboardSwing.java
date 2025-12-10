package vista;

import com.formdev.flatlaf.FlatLightLaf;
import controlador.InventarioController;
import modelo.Producto;
import modelo.Proveedor;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.net.URI;
import java.util.List;

public class DashboardSwing extends JFrame {

    private final InventarioController controller;
    private final JDesktopPane desktop;

    public DashboardSwing(InventarioController controller) {
        this.controller = controller;

        // Aplicar tema FlatLaf
        try {
            UIManager.setLookAndFeel(new FlatLightLaf());
        } catch (Exception ex) {
            System.err.println("No se pudo aplicar FlatLaf: " + ex.getMessage());
        }

        setTitle("Sistema de Inventarios - Plaza Vea");
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        desktop = new JDesktopPane();
        desktop.setBackground(new Color(245, 245, 245));
        setContentPane(desktop);

        crearSidebar();
    }

    private void crearSidebar() {
        JPanel sidebar = new JPanel();
        sidebar.setLayout(new GridLayout(0, 1, 15, 15));
        sidebar.setBackground(new Color(33, 150, 243));
        sidebar.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        sidebar.setPreferredSize(new Dimension(220, 0));

        JButton btnInventario = crearBoton("Gestionar Inventario", "\uD83D\uDCE6");
        btnInventario.addActionListener(e -> abrirInventarioFrame());

        JButton btnProveedores = crearBoton("Proveedores", "\uD83D\uDC64");
        btnProveedores.addActionListener(e -> abrirProveedoresFrame());

        JButton btnWeb = crearBoton("Abrir Web", "\uD83D\uDD17");
        btnWeb.addActionListener(e -> abrirWeb("https://www.google.com"));

        sidebar.add(btnInventario);
        sidebar.add(btnProveedores);
        sidebar.add(btnWeb);

        getContentPane().setLayout(new BorderLayout());
        getContentPane().add(sidebar, BorderLayout.WEST);
    }

    private JButton crearBoton(String texto, String icono) {
        JButton btn = new JButton(icono + " " + texto);
        btn.setFocusPainted(false);
        btn.setBackground(Color.WHITE);
        btn.setForeground(new Color(33, 150, 243));
        btn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private void abrirInventarioFrame() {
        JInternalFrame frame = new JInternalFrame("Inventario", true, true, true, true);
        frame.setSize(900, 500);
        frame.setVisible(true);

        String[] columnas = {"Código", "Nombre", "Stock", "Precio", "Proveedor"};
        DefaultTableModel modelo = new DefaultTableModel(columnas, 0);

        List<Producto> productos = controller.getStockEnMemoria().values().stream().toList();
        for (Producto p : productos) {
            modelo.addRow(new Object[]{
                    p.getCodigo(),
                    p.getNombre(),
                    p.getStockActual(),
                    p.getPrecioUnitario(),
                    p.getProveedor().getRazonSocial()
            });
        }

        JTable tabla = new JTable(modelo);
        tabla.setFillsViewportHeight(true);
        tabla.setRowHeight(25);
        tabla.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        JScrollPane scroll = new JScrollPane(tabla);

        frame.add(scroll, BorderLayout.CENTER);
        desktop.add(frame);
        try { frame.setSelected(true); } catch (Exception ignored) {}
    }

    private void abrirProveedoresFrame() {
        JInternalFrame frame = new JInternalFrame("Proveedores", true, true, true, true);
        frame.setSize(700, 400);
        frame.setVisible(true);

        String[] columnas = {"RUC", "Razón Social", "Contacto"};
        DefaultTableModel modelo = new DefaultTableModel(columnas, 0);

        List<Proveedor> proveedores = controller.obtenerTodosProveedores();
        for (Proveedor p : proveedores) {
            modelo.addRow(new Object[]{
                    p.getRuc(),
                    p.getRazonSocial(),
                    p.getContacto()
            });
        }

        JTable tabla = new JTable(modelo);
        tabla.setFillsViewportHeight(true);
        tabla.setRowHeight(25);
        tabla.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        JScrollPane scroll = new JScrollPane(tabla);

        frame.add(scroll, BorderLayout.CENTER);
        desktop.add(frame);
        try { frame.setSelected(true); } catch (Exception ignored) {}
    }

    private void abrirWeb(String url) {
        try {
            Desktop.getDesktop().browse(new URI(url));
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this,
                    "No se pudo abrir el navegador",
                    "Error",
                    JOptionPane.ERROR_MESSAGE);
        }
    }
}

