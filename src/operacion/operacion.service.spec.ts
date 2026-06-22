import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerService } from '../common/circuit-breaker/circuit-breaker.service';
import { OperacionService } from './operacion.service';

describe('OperacionService', () => {
  let service: OperacionService;
  let httpService: { axiosRef: { get: jest.Mock } };

  beforeEach(async () => {
    httpService = { axiosRef: { get: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperacionService,
        CircuitBreakerService,
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get(OperacionService);
  });

  it('reenvia el header Authorization recibido hacia ms-operacion', async () => {
    const viajes = [{ id: 1, estado: 'Completado' }];
    httpService.axiosRef.get.mockResolvedValue({ data: viajes });

    const result = await service.getViajes('Bearer token-123');

    expect(result).toEqual(viajes);
    expect(httpService.axiosRef.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/operacion/viajes'),
      { headers: { Authorization: 'Bearer token-123' } },
    );
  });

  it('propaga el error si la llamada HTTP falla (para que el breaker lo cuente)', async () => {
    httpService.axiosRef.get.mockRejectedValue(new Error('connection refused'));

    await expect(service.getViajes('Bearer token-123')).rejects.toThrow(
      'connection refused',
    );
  });
});
