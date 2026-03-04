# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.1.0-alpha] - 2026-03-04
### Añadido (Added)
- Inicialización del proyecto bajo stack moderno (React 19 + TypeScript + Vite).
- Estructuración de la arquitectura principal frontend-backend dentro del mismo repositorio.
- Configuración de utilidades CSS con Tailwind CSS v4.
- Integración de servidor Express de desarrollo simulando el entorno de Vercel Serverless.
- Endpoints fundamentales implementados en backend (`/api/login`, `/api/committees`, `/api/meetings`, `/api/documents/upload`, `/api/users`).
- Estructura y modelos PostgreSQL para gobernanza corporativa, reuniones, asistencia y usuarios.
- Subsistema básico de validación y control de sesiones mediante JSON Web Tokens (JWT).
- Reglas de estilo global de código con ESLint 9 + typescript-eslint.
- Archivos estándar de Documentación (README, ARCHITECTURE, TECH_STACK, REQUIREMENTS, CONTRIBUTING, SECURITY).

### Cambiado (Changed)
- N/A

### Deprecado (Deprecated)
- N/A

### Eliminado (Removed)
- N/A

### Arreglado (Fixed)
- N/A

### Seguridad (Security)
- Setup inicial de ofuscación de contraseñas de Base de Datos apoyándose en `bcryptjs`.
- Uso mandatario de middleware de validación HTTP de JWT para funciones protegidas en entorno de servidor Express.
