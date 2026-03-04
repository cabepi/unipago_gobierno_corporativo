# Stack Tecnológico (Tech Stack)

Este documento detalla las tecnologías, frameworks y herramientas clave implementadas en el proyecto. Las versiones reflejadas corresponden a las dependencias actuales del entorno de desarrollo y producción extraídas de `package.json`.

## Frontend
| Tecnología | Versión Exacta | Propósito / Descripción |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Librería principal para la construcción de interfaces de usuario. |
| **React DOM** | `^19.2.0` | Renderizador para la web. |
| **React Router DOM** | `^7.13.1` | Manejo de enrutamiento y navegación en la SPA. |
| **Tailwind CSS** | `^4.2.1` | Framework de CSS utilitario para diseño de componentes. (Usa plugin `@tailwindcss/vite`). |
| **Lucide React** | `^0.575.0` | Biblioteca de íconos vectoriales para la UI. |

## Backend / API
| Tecnología | Versión Exacta | Propósito / Descripción |
| :--- | :--- | :--- |
| **Node.js** | Entorno (`@types/node ^24.10.1`) | Entorno de ejecución de tiempo real para JavaScript/TypeScript. |
| **Express** | `^5.2.1` | Framework backend minimalista para enrutamiento local y APIs. |
| **pg (node-postgres)** | `^8.18.0` | Cliente oficial de PostgreSQL para Node.js, usado para consultas a DB. |
| **JWT** | `^9.0.3` | Implementación de tokens JWT (`jsonwebtoken`) para autenticación stateless. |
| **BcryptJS** | `^3.0.3` | Biblioteca para el hashing y ofuscación de contraseñas. |
| **Multer** | `^2.0.2` | Middleware de Express manejando el guardado de multipart/form-data (uploads). |
| **Vercel Blob** | `^2.3.0` | SDK `@vercel/blob` (Pendiente integración completa/en uso para file storage). |
| **Cors** | `^2.8.6` | Middleware para Cross-Origin Resource Sharing. |

## Base de Datos
| Tecnología | Versión | Propósito / Descripción |
| :--- | :--- | :--- |
| **PostgreSQL** | *No especificada localmente, asume v14+* | Motor de base de datos relacional para guardar entidades de la organización, usuarios, actas y reuniones. |

## Herramientas de Desarrollo y Build
| Herramienta | Versión Exacta | Propósito / Descripción |
| :--- | :--- | :--- |
| **Vite** | `^7.3.1` | Bundler y servidor de desarrollo ultra-rápido para frontend. |
| **TypeScript** | `~5.9.3` | Lenguaje de desarrollo para incorporar tipos estáticos robustos. |
| **TSX** | `^4.21.0` | Intérprete TypeScript usado para ejecutar el servidor Express de forma nativa (`src/server/index.ts`). |
| **ESLint** | `^9.39.1` | Linter integrado para mantener consistencia estandarizada de código y estilo. |
| **Concurrently** | `^9.2.1` | Herramienta CLI para ejecutar múltiples comandos asíncronos en modo de desarrollo (`dev`). |

## CI/CD y Despliegue (Infraestructura)
| Herramienta | Estado | Propósito / Descripción |
| :--- | :--- | :--- |
| **Vercel** | *Preparado* | Previsto para hostear funciones API Serverless o el frontend. |
| **GitHub Actions** | *Pendiente* | Pipeline de integración continua pendiente de definición. |
