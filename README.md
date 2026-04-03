# Sistema de Gestión de Pedidos - ElectroNova

![Status](https://img.shields.io/badge/Status-Fase%204%20Finalizada-green)
![Deployment](https://img.shields.io/badge/Deployed%20on-Render-blue)
![Architecture](https://img.shields.io/badge/Architecture-Modular-orange)

**ElectroNova** es una plataforma comercial de alta fidelidad diseñada para la gestión integral de pedidos de electrodomésticos. El proyecto evolucionó desde una inicial "Fábrica en Caos" (Fase 1) hasta consolidar una arquitectura modular escalable y profesional (Fase 4).

## Enlaces del Proyecto

* **Demo en vivo (Render):** [https://sistema-de-gestion-de-pedidos.onrender.com/](https://sistema-de-gestion-de-pedidos.onrender.com/)
* **Prototipo Interactivo (Figma):** [https://less-decoy-71247673.figma.site/login](https://less-decoy-71247673.figma.site/login)

## Arquitectura del Sistema (Producción)

El sistema utiliza una arquitectura orientada a servicios para garantizar la separación de responsabilidades:

* **Capa de Acceso (Gatekeeper):** Middleware de autenticación que valida el rol del usuario (Dueño, Cliente o Repartidor) antes de otorgar acceso a los módulos.
* **Capa de Persistencia:** Conexión a una base de datos relacional externa que asegura la integridad de la información y evita la pérdida de datos al navegar.
* **Infraestructura CI/CD:** Flujo de trabajo automatizado desde **GitHub** hacia **Render**, garantizando una disponibilidad del sistema 24/7.

## Roles y Funcionalidades (RBAC)

El sistema implementa un control de acceso basado en roles para una gestión segura:

### Cliente
* **Registro Autónomo:** Creación de cuenta y login centralizado.
* **Catálogo Enriquecido:** Visualización de productos con imágenes reales, descripciones y motor de descuentos.
* **Pasarela de Pago:** Checkout simulado con validación de tarjetas de crédito/débito.
* **Seguimiento:** Panel de "Mis Pedidos" con indicador visual de estado.

### Administrador / Dueño
* **Gestión de Inventario:** Panel para control de stock, actualización de precios y altas de productos.
* **Gestión de Personal:** Creación de cuentas para repartidores y monitoreo de entregas.
* **Métricas en Tiempo Real:** Dashboard con total de pedidos y estados logísticos.

### Repartidor
* **Hoja de Ruta:** Visualización de pedidos asignados y direcciones de entrega.
* **Actualización de Estados:** Gestión del ciclo de vida del pedido (Pendiente → En Camino → Entregado).

## Tecnologías
* **Diseño:** Figma (Alta Fidelidad)
* **Frontend:** React / Vite con Tailwind CSS
* **Despliegue:** Render
* **Control de Versiones:** Git & GitHub

---
*Este proyecto fue desarrollado para el curso de Ingeniería de Software (2026).*
