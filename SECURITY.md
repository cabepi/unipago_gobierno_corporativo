# Política de Seguridad (SECURITY.md)

## Versiones Soportadas

Actualmente el proyecto en su fase Alpha e inicial de desarrollo. Solo se está proveyendo soporte activo en la rama matriz y no existen parches de retroceso (backports) a versiones antiguas.

| Versión | Soporte |
| :--- | :--- |
| `0.1.x-alpha` | :white_check_mark: |
| `< 0.1.0` | :x: |

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad dentro de las herramientas o APIs de Unipago Gobierno Corporativo (incluidos exploits de inyección SQL, evasión de JWT, etc.), por favor **NO la expongas de manera pública** mediante un Issue en repositorios de seguimiento abiertos.

1.  Envía un correo con los detalles técnicos a los administradores de la arquitectura y líderes técnicos del proyecto.
2.  El equipo de seguridad acusará recibo en un plazo de 48 horas.
3.  Te mantendremos informado sobre el progreso hacia la solución y un despliegue planificado para asegurar el parche antes de divulgarlo.

## Prácticas Recomendadas del Entorno
Por diseño de la arquitectura y dependencias:
*   **Nunca subas el archivo `.env` o credenciales estáticas de PostgreSQL, Secretos JWT o API Keys a control de versiones.** (.gitignore ya los excluye).
*   Se insta a los desarrolladores a utilizar algoritmos como `bcryptjs` de forma exclusiva para ofuscación y hashing seguro de contraseñas de negocio, con un salting round por defecto ajustado para la infraestructura pertinente (ej. `10` or superior).
*   Garantiza que el proxy del frontend no pase cabeceras o payloads sensitivos en URLs visibles que viajen directamente hacia `/api`. Para autenticación, se usa la cabecera estándar `Authorization: Bearer <token>`.
