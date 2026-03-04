# Requerimientos del Sistema

## Requerimientos Funcionales (Casos de Uso)

El sistema soporta actualmente y/o está en proceso de soportar los siguientes casos de uso principales:

1.  **Gestión de Comités:**
    *   Listar comités existentes y visualizar detalles de cada comité (`/api/committees`, `/api/committee`).
    *   Consultar miembros de cada comité y sus roles específicos (ej. Secretario).

2.  **Gestión de Reuniones:**
    *   Listar reuniones programadas, en proceso o finalizadas (`/api/meetings`).
    *   Consultar el detalle de una reunión específica (fecha, hora, lugar, tipo ordinaria/extraordinaria) (`/api/meeting`).
    *   Descargar archivos de calendario (ICS) asociados a la reunión.

3.  **Gestión de Agenda:**
    *   Visualizar los puntos de la agenda (tópicos) y el tiempo asignado por reunión.

4.  **Gestión de Participantes y Asistencia:**
    *   Verificar el listado de participantes convocados y su estado de asistencia (Presente, Ausente, Pendiente de Firma).

5.  **Interacción y Documentación:**
    *   Visualización y carga de documentos asociados a la reunión (`/api/documents/upload`).
    *   Publicación de comentarios en el muro/bitácora de la reunión (`/api/meeting/comments`).

6.  **Flujo de Aprobaciones y Firmas:**
    *   Soporte para recolección de firmas de documentos o actas (`/api/signatures`).

7.  **Autenticación y Seguridad:**
    *   Inicio de sesión de usuarios (`/api/login`).
    *   Validación de sesión para proteger recursos privados de la organización.

## Requerimientos No Funcionales

1.  **Seguridad:**
    *   Cifrado de contraseñas de usuarios en base de datos utilizando `bcryptjs`.
    *   Protección de rutas API utilizando JSON Web Tokens (`jsonwebtoken`) como mecanismo de autorización stateless.
    *   Manejo de CORS para restringir accesos no autorizados a la API.

2.  **Rendimiento y Escalabilidad:**
    *   Arquitectura stateless del backend, preparada para despliegues Serverless o contenedores independientes.
    *   Empaquetado optimizado del frontend utilizando `Vite` y compilador `SWC`/`Babel`.

3.  **Mantenibilidad:**
    *   Tipado estático intensivo con `TypeScript` a través del stack completo para reducir errores en tiempo de ejecución.
    *   Reglas de 'linting' estrictas configuradas vía `ESLint`.

4.  **Concurrencia en Desarrollo:**
    *   Uso de `concurrently` para ejecutar simultáneamente el entorno Vite y el servidor proxy NodeJS, simplificando la experiencia de DX (Developer Experience).
