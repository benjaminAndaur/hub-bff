import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';
import { FacturaDto } from './dto/factura.dto';

/**
 * Adaptador HTTP hacia ms-facturacion: mismo rol que OperacionService,
 * aplicado al microservicio de facturación.
 */
@Injectable()
export class FacturacionService {
  private readonly baseUrl =
    process.env.FACTURACION_BASE_URL ?? 'http://ms-facturacion:8000';

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  async getFacturas(authorization: string): Promise<FacturaDto[]> {
    return this.circuitBreaker.run('facturacion', async () => {
      const { data } = await this.httpService.axiosRef.get<FacturaDto[]>(
        `${this.baseUrl}/api/v1/facturacion/facturas`,
        { headers: { Authorization: authorization } },
      );
      return data;
    });
  }
}
