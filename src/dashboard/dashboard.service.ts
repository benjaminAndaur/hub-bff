import { Injectable } from '@nestjs/common';
import { FacturacionService } from '../facturacion/facturacion.service';
import { OperacionService } from '../operacion/operacion.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

/**
 * Agregador BFF: combina viajes (Operación) + facturas (Facturación) en
 * un solo payload. Usa Promise.allSettled (no Promise.all) para que el
 * fallo de una dependencia no tumbe la respuesta completa — la sección
 * caída queda vacía y se marca "degraded" en meta, siempre HTTP 200.
 */
@Injectable()
export class DashboardService {
  constructor(
    private readonly operacionService: OperacionService,
    private readonly facturacionService: FacturacionService,
  ) {}

  async getDashboard(authorization: string): Promise<DashboardResponseDto> {
    const [viajesResult, facturasResult] = await Promise.allSettled([
      this.operacionService.getViajes(authorization),
      this.facturacionService.getFacturas(authorization),
    ]);

    return {
      viajes: viajesResult.status === 'fulfilled' ? viajesResult.value : [],
      facturacion:
        facturasResult.status === 'fulfilled' ? facturasResult.value : [],
      meta: {
        viajes_status: viajesResult.status === 'fulfilled' ? 'ok' : 'degraded',
        facturacion_status:
          facturasResult.status === 'fulfilled' ? 'ok' : 'degraded',
      },
    };
  }
}
