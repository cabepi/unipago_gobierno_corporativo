# Unipago Gobierno Corporativo

## Descripción del Proyecto
Plataforma integral para la gestión de gobierno corporativo. Permite la administración eficiente de comités, planificación y seguimiento de reuniones, gestión de actas, registro de asistencia, carga de documentos y control de firmas electrónicas.

## Estado de Construcción
**Fase de Desarrollo Activa (v0.1.0-alpha)**
Actualmente, el proyecto cuenta con la base de arquitectura estructurada, frontend construido en React 19 y un backend en Node.js (Express) que expone servicios RESTful conectados a una base de datos PostgreSQL. Las funcionalidades principales de lectura y gestión de reuniones están en etapa de implementación.

## Prerrequisitos
- Node.js (v20 o superior recomendado)
- PostgreSQL (v14 o superior recomendado)
- Variables de entorno configuradas (basarse en `.env.example`)

## Guía Rápida de Instalación

1.  **Clonar el repositorio y acceder al directorio:**
    ```bash
    git clone <url-del-repositorio>
    cd unipago_gobierno_corporativo
    ```

2.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Copia el archivo `.env.example` a `.env` y ajusta los valores necesarios (conexión a BD, JWT secret, etc.).
    ```bash
    cp .env.example .env
    ```

## Comandos de Desarrollo

-   **Iniciar el entorno de desarrollo (Frontend + Backend concurrentes):**
    ```bash
    npm run dev
    ```
    *El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3001/api`.*

-   **Compilar para producción:**
    ```bash
    npm run build
    ```

-   **Visualizar compilación de producción:**
    ```bash
    npm run preview
    ```

-   **Ejecutar el linter:**
    ```bash
    npm run lint
    ```
