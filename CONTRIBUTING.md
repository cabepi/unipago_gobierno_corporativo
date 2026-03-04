# Guía de Contribución (CONTRIBUTING.md)

¡Gracias por tu interés en contribuir a **Unipago Gobierno Corporativo**! Este documento define las pautas estándar para trabajar en el ecosistema, asegurando la mantenibilidad a largo plazo.

## 1. Flujo de Trabajo con Ramas (Git Flow)

Adoptamos una versión simplificada de Git Flow para la gestión de características y entregas:

*   **`main`**: Rama de producción. El código aquí debe ser siempre estable y desplegable.
*   **`develop`**: Rama principal de desarrollo. Contiene los últimos cambios entregados para la próxima 'release'. Todas las nuevas características parten de esta rama.
*   **`feature/<nombre-descriptivo>`**: Ramas para nuevas características o requerimientos. (Ejemplo: `feature/login-jwt`).
*   **`bugfix/<nombre-descriptivo>`**: Ramas para arreglos rápidos de errores en QA o desarrollo.
*   **`hotfix/<nombre-descriptivo>`**: Ramas para parches urgentes que van directo hacia `main`.

No fusiones código directamente en `main` o `develop` sin un Pull Request (PR).

## 2. Convención de Commits (Conventional Commits)

Nuestros mensajes de commit siguen la especificación de [Conventional Commits](https://www.conventionalcommits.org/). La estructura general es:

```
<tipo>[scope opcional]: <descripción en imperativo>

[cuerpo opcional detallado]
```

**Tipos Permitidos:**
*   `feat`: Una nueva característica.
*   `fix`: Un arreglo de un fallo o bug.
*   `docs`: Cambios exclusivos en la documentación (ej. README).
*   `style`: Cambios que no afectan el significado del código (espaciado, formateo, punto y coma omitido, etc.).
*   `refactor`: Cambio de código que ni arregla un fallo ni añade una característica.
*   `perf`: Cambio de código que mejora el rendimiento.
*   `test`: Añadir o corregir pruebas faltantes.
*   `chore`: Cambios en el proceso de compilación, construcción o herramientas auxiliares.

**Ejemplos:**
*   `feat(auth): implementar middleware para validación de JWT`
*   `fix(ui): corregir desbordamiento del modal en vista móvil`
*   `docs: generar archivos de arquitectura y requerimientos`

## 3. Estilo de Código y Linter

El proyecto hace fuerte uso de **TypeScript** (`TS` / `TSX`) y contiene una configuración robusta de **ESLint**.

*   Antes de crear un Pull Request, siempre comprueba errores de estilo corriendo:
    ```bash
    npm run lint
    ```
*   Asegúrate de resolver cualquier conflicto tipográfico o de tipado. No uses el tipo `any` a menos que sea estructuralmente imposible determinar el tipo, y en esos casos deja un comentario exhaustivo.

## 4. Estructura de Pull Requests

Al abrir un PR hacia `develop`:
1.  **Título Descriptivo:** Usa el mismo formato de *Conventional Commits* en el título del PR.
2.  **Referencia a la Tarea:** Si existe un ticket (Jira, GitHub ID), menciónalo.
3.  **Descripción de los cambios:** Ofrece un resumen de las partes que tocas para asistir al revisor.

---
*Al contribuir activamente, acuerdas respetar estos procesos para profesionalizar el ciclo de vida del software del proyecto.*
