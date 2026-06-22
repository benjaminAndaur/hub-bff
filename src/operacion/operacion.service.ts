import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';
import { ViajeDto } from './dto/viaje.dto';

/**
 * Adaptador HTTP hacia ms-operacion: el equivalente al patrón Repository
 * pero para una fuente remota en vez de una base de datos. No decodifica
 * el JWT recibido, solo lo reenvía — la validación real ya ocurre en
 * nginx (auth_request) y de nuevo en ms-operacion (@login_required).
 */
@Injectable()
export class OperacionService {
  private readonly baseUrl =
    process.env.OPERACION_BASE_URL ?? 'http://ms-operacion:8000';

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  async getViajes(authorization: string): Promise<ViajeDto[]> {
    return this.circuitBreaker.run('operacion', async () => {
      const { data } = await this.httpService.axiosRef.get<ViajeDto[]>(
        `${this.baseUrl}/api/v1/operacion/viajes`,
        { headers: { Authorization: authorization } },
      );
      return data;
    });
  }
}
