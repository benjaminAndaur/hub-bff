import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: { getDashboard: jest.Mock };

  beforeEach(async () => {
    dashboardService = { getDashboard: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: dashboardService }],
    }).compile();

    controller = module.get(DashboardController);
  });

  it('responde ok en el health check publico', () => {
    expect(controller.health()).toEqual({ status: 'ok', service: 'bff' });
  });

  it('extrae el header Authorization y lo reenvia al service', async () => {
    const payload = {
      viajes: [],
      facturacion: [],
      meta: { viajes_status: 'ok' as const, facturacion_status: 'ok' as const },
    };
    dashboardService.getDashboard.mockResolvedValue(payload);

    const result = await controller.getDashboard('Bearer token-123');

    expect(dashboardService.getDashboard).toHaveBeenCalledWith(
      'Bearer token-123',
    );
    expect(result).toEqual(payload);
  });
});
