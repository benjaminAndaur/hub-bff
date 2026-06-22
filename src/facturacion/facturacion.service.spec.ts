import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';
import { FacturacionService } from './facturacion.service';

describe('FacturacionService', () => {
  let service: FacturacionService;
  let httpService: { axiosRef: { get: jest.Mock } };

  beforeEach(async () => {
    httpService = { axiosRef: { get: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturacionService,
        CircuitBreakerService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get(FacturacionService);
  });

  it('reenvia el header Authorization recibido hacia ms-facturacion', async () => {
    const facturas = [{ id: 1, cliente: 'Minera Los Andes', estado: 'Pagada' }];
    httpService.axiosRef.get.mockResolvedValue({ data: facturas });

    const result = await service.getFacturas('Bearer token-123');

    expect(result).toEqual(facturas);
    expect(httpService.axiosRef.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/facturacion/facturas'),
      { headers: { Authorization: 'Bearer token-123' } },
    );
  });

  it('propaga el error si la llamada HTTP falla (para que el breaker lo cuente)', async () => {
    httpService.axiosRef.get.mockRejectedValue(new Error('connection refused'));

    await expect(service.getFacturas('Bearer token-123')).rejects.toThrow(
      'connection refused',
    );
  });
});
