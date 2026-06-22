# Guía de pruebas — hub-bff

## Ejecutar los tests

```bash
npm install
npm run test            # corre toda la suite
npm run test:cov        # corre la suite + genera reporte de cobertura
```

`npm run test:cov` falla si la cobertura global cae por debajo del umbral configurado en `package.json` (`jest.coverageThreshold`): **60%** en branches, functions, lines y statements — el mismo mínimo exigido en el resto del proyecto (pytest/vitest).

El reporte HTML queda en `coverage/lcov-report/index.html`; el reporte `lcov.info` (consumido por SonarQube, ver `sonar-project.properties`) queda en `coverage/lcov.info`.

## Qué cubre cada suite

| Archivo | Qué prueba |
|---|---|
| `src/common/circuit-breaker/circuit-breaker.service.spec.ts` | El breaker abre tras fallos repetidos, deja de invocar la acción una vez abierto, y mantiene breakers independientes por key (un servicio caído no afecta al otro). |
| `src/operacion/operacion.service.spec.ts` | El adaptador reenvía el header `Authorization` recibido hacia `ms-operacion`; un error HTTP se propaga (para que el breaker lo cuente como fallo). |
| `src/facturacion/facturacion.service.spec.ts` | Análogo, contra `ms-facturacion`. |
| `src/dashboard/dashboard.service.spec.ts` | El agregador combina ambas respuestas cuando todo funciona; degrada solo la sección afectada si un servicio falla (la otra sigue con datos); degrada ambas si los dos fallan — nunca lanza excepción. |
| `src/dashboard/dashboard.controller.spec.ts` | El controller expone `/health` y extrae el header `Authorization` correctamente hacia el service. |

Todos los servicios externos (`HttpService`, los servicios de operación/facturación) se mockean con `jest.fn()` — no se hace ninguna llamada de red real en los tests unitarios.

## Verificación manual end-to-end (con Docker)

```bash
cd ../hub-infra
docker-compose up --build

curl http://localhost:8080/api/v1/bff/health
# Login para obtener un token real
curl -X POST http://localhost:8080/api/v1/administracion/login \
  -H "Content-Type: application/json" \
  -d '{"email":"operacion@asdf.cl","password":"user123"}'

curl -H "Authorization: Bearer <token>" http://localhost:8080/api/v1/bff/dashboard
```

Para probar el fallback del Circuit Breaker en vivo, ver la sección correspondiente en `README.md`.
