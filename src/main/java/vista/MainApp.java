package vista;

import persistencia.InventarioDAOImpl;
import persistencia.ConexionDBMySQL;
import persistencia.ProveedorDAOImpl;
import persistencia.IConexionDB;
import com.formdev.flatlaf.FlatLightLaf;
import controlador.InventarioController;

import javax.swing.*;

public class MainApp {

    public static void main(String[] args) {

        System.out.println("--- Inicialización del Sistema Plaza Vea (MVC + DAO + Swing) ---");

        try {
            // === 1. Aplicar Look & Feel FlatLaf ===
            UIManager.setLookAndFeel(new FlatLightLaf());

            // === 2. Configurar DAOs y conexión a BD ===
            IConexionDB conexionDB = new ConexionDBMySQL(
                    "jdbc:mysql://localhost:3306/inventario",
                    "admin",
                    "270509"
            );

            InventarioDAOImpl inventarioDAO = new InventarioDAOImpl(conexionDB);
            ProveedorDAOImpl proveedorDAO = new ProveedorDAOImpl(conexionDB);

            InventarioController controller = new InventarioController(inventarioDAO, proveedorDAO);

            // === 3. Cargar inventario serializado si existe (opcional) ===
            controller.cargarInventarioSerializado();

            // === 4. Iniciar interfaz gráfica Swing ===
            SwingUtilities.invokeLater(() -> {
                DashboardSwing ventana = new DashboardSwing(controller);
                ventana.setVisible(true);
            });

        } catch (Exception e) {
            System.err.println("El sistema no pudo iniciar: " + e.getMessage());
        }
    }
}
