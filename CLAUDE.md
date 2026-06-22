# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Flujo de Git (GitFlow)

Este repo (y los otros del Hub: `hub-infra`, `hub-backends`, `hub-ms-operacion`, `hub-ms-facturacion`, `hub-frontends`) usa **GitFlow**. Reglas:

- `main` — solo recibe merges desde `develop` o `release/*`. Representa lo desplegable/estable. **Nunca commitear directo aquí.**
- `develop` — rama de integración. Todo el trabajo nuevo (fixes, features) se commitea o mergea aquí primero.
- `feature/*`, `fix/*` — ramas de trabajo creadas desde `develop`, mergeadas de vuelta a `develop`.
- `release/*` — ramas de preparación de release creadas desde `develop`, mergeadas a `main` y de vuelta a `develop`.
- `hotfix/*` — para bugs urgentes en producción: se crean desde `main`, se mergean a **ambos** `main` y `develop`.

Antes de empezar a trabajar, verificar en qué rama se está parado (`git branch --show-current`). Si hay cambios sin commitear directo en `main`, moverlos a `develop` (o a una rama `fix/*`/`feature/*` desde `develop`) antes de commitear.

## Resumen del proyecto

BFF (Backend for Frontend) del Hub Empresarial, en NestJS — la única pieza Node del stack (el resto de microservicios son Python/Quart), lo que demuestra un backend políglota. Agrega en un solo payload los datos de `ms-operacion` (viajes) y `ms-facturacion` (facturas), y envuelve cada llamada downstream con el patrón **Circuit Breaker** (`opossum`). Ver `README.md` para arquitectura, endpoints y cómo demostrar el breaker en vivo.

### Capas

```
src/
  common/circuit-breaker/   # CircuitBreakerService: wrapper genérico sobre opossum, un breaker por key
  operacion/                # OperacionService: adaptador HTTP hacia ms-operacion
  facturacion/               # FacturacionService: adaptador HTTP hacia ms-facturacion
  dashboard/                # DashboardService (agregador, Promise.allSettled) + DashboardController
```

El BFF no decodifica el JWT recibido — solo reenvía el header `Authorization` crudo a cada microservicio. La validación real ocurre en nginx (`auth_request`) y de nuevo en cada microservicio (`@login_required`).

### Tests

```bash
npm run test        # unit tests (Jest)
npm run test:cov     # con reporte de cobertura, umbral global 60%
```

Repos relacionados:
- [`hub-infra`](https://github.com/benjaminAndaur/hub-infra) — nginx (rutas `/api/v1/bff/*`, `/bff/docs`), `docker-compose.yml` (servicio `bff`).
- [`hub-ms-operacion`](https://github.com/benjaminAndaur/hub-ms-operacion) — microservicio de viajes que este BFF agrega.
- [`hub-ms-facturacion`](https://github.com/benjaminAndaur/hub-ms-facturacion) — microservicio de facturación que este BFF agrega.
- [`hub-backends`](https://github.com/benjaminAndaur/hub-backends) — resto de microservicios del Hub (monorepo Python/Quart).
- [`hub-frontends`](https://github.com/benjaminAndaur/hub-frontends) — frontends React/Vite.
