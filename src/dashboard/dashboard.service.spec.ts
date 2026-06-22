import { Test, TestingModule } from '@nestjs/testing';
import { FacturacionService } from '../facturacion/facturacion.service';
import { OperacionService } from '../operacion/operacion.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let operacionService: { getViajes: jest.Mock };
  let facturacionService: { getFacturas: jest.Mock };

  beforeEach(async () => {
    operacionService = { getViajes: jest.fn() };
    facturacionService = { getFacturas: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: OperacionService, useValue: operacionService },
        { provide: FacturacionService, useValue: facturacionService },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  it('combina viajes y facturas cuando ambos servicios responden ok', async () => {
    const viajes = [{ id: 1, estado: 'Completado' }];
    const facturas = [{ id: 1, cliente: 'Minera Los Andes' }];
    operacionService.getViajes.mockResolvedValue(viajes);
    facturacionService.getFacturas.mockResolvedValue(facturas);

    const result = await service.getDashboard('Bearer token-123');

    expect(result.viajes).toEqual(viajes);
    expect(result.facturacion).toEqual(facturas);
    expect(result.meta).toEqual({
      viajes_status: 'ok',
      facturacion_status: 'ok',
    });
  });

  it('degrada solo la sección de facturación si ese servicio falla, sin afectar viajes', async () => {
    const viajes = [{ id: 1, estado: 'Completado' }];
    operacionService.getViajes.mockResolvedValue(viajes);
    facturacionService.getFacturas.mockRejectedValue(new Error('caido'));

    const result = await service.getDashboard('Bearer token-123');

    expect(result.viajes).toEqual(viajes);
    expect(result.facturacion).toEqual([]);
    expect(result.meta).toEqual({
      viajes_status: 'ok',
      facturacion_status: 'degraded',
    });
  });

  it('degrada solo la sección de viajes si ese servicio falla, sin afectar facturacion', async () => {
    const facturas = [{ id: 1, cliente: 'Minera Los Andes' }];
    operacionService.getViajes.mockRejectedValue(new Error('caido'));
    facturacionService.getFacturas.mockResolvedValue(facturas);

    const result = await service.getDashboard('Bearer token-123');

    expect(result.viajes).toEqual([]);
    expect(result.facturacion).toEqual(facturas);
    expect(result.meta).toEqual({
      viajes_status: 'degraded',
      facturacion_status: 'ok',
    });
  });

  it('degrada ambas secciones si los dos servicios fallan, sin lanzar excepción', async () => {
    operacionService.getViajes.mockRejectedValue(new Error('caido'));
    facturacionService.getFacturas.mockRejectedValue(new Error('caido'));

    const result = await service.getDashboard('Bearer token-123');

    expect(result).toEqual({
      viajes: [],
      facturacion: [],
      meta: { viajes_status: 'degraded', facturacion_status: 'degraded' },
    });
  });
});
