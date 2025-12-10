package config;

import controlador.InventarioController;
import persistencia.InventarioDAOImpl;
import persistencia.ProveedorDAOImpl;
import persistencia.ConexionDBMySQL;
import persistencia.IConexionDB;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public InventarioController inventarioController() {
        IConexionDB conexionDB = new ConexionDBMySQL(
                "jdbc:mysql://localhost:3306/inventario",
                "admin",
                "270509"
        );

        InventarioDAOImpl inventarioDAO = new InventarioDAOImpl(conexionDB);
        ProveedorDAOImpl proveedorDAO = new ProveedorDAOImpl(conexionDB);

        InventarioController controller = new InventarioController(inventarioDAO, proveedorDAO);
        controller.cargarInventarioSerializado(); // opcional
        return controller;
    }
}
