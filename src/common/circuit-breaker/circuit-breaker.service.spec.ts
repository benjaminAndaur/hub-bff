import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerService } from './circuit-breaker.service';

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService;

  beforeEach(async () => {
    process.env.CB_ERROR_THRESHOLD_PERCENTAGE = '50';
    process.env.CB_TIMEOUT_MS = '100';
    process.env.CB_RESET_TIMEOUT_MS = '200';

    const module: TestingModule = await Test.createTestingModule({
      providers: [CircuitBreakerService],
    }).compile();

    service = module.get(CircuitBreakerService);
  });

  it('arranca en estado UNKNOWN para una key nunca usada', () => {
    expect(service.getState('nunca-usada')).toBe('UNKNOWN');
  });

  it('ejecuta la acción y devuelve su resultado cuando el circuito está cerrado', async () => {
    const action = jest.fn().mockResolvedValue('ok');

    const result = await service.run('servicio-sano', action);

    expect(result).toBe('ok');
    expect(service.getState('servicio-sano')).toBe('CLOSED');
  });

  it('abre el circuito tras fallos repetidos y deja de invocar la acción', async () => {
    const action = jest.fn().mockRejectedValue(new Error('downstream caído'));

    for (let i = 0; i < 10; i++) {
      await service.run('servicio-caido', action).catch(() => undefined);
    }

    expect(service.getState('servicio-caido')).toBe('OPEN');

    const callCountWhenOpened = action.mock.calls.length;
    await service.run('servicio-caido', action).catch(() => undefined);

    expect(action.mock.calls.length).toBe(callCountWhenOpened);
  });

  it('mantiene breakers independientes por key', async () => {
    const sano = jest.fn().mockResolvedValue('ok');
    const caido = jest.fn().mockRejectedValue(new Error('falla'));

    for (let i = 0; i < 10; i++) {
      await service.run('independiente-caido', caido).catch(() => undefined);
    }
    await service.run('independiente-sano', sano);

    expect(service.getState('independiente-caido')).toBe('OPEN');
    expect(service.getState('independiente-sano')).toBe('CLOSED');
  });
});
