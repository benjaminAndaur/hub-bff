import { Injectable, Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';
import { CIRCUIT_BREAKER_OPTIONS } from './circuit-breaker.config';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN' | 'UNKNOWN';

/**
 * Patrón Circuit Breaker: envuelve llamadas a microservicios downstream.
 * Cada `key` (ej. 'operacion', 'facturacion') obtiene su propio breaker
 * independiente, así que un servicio caído no afecta el circuito del otro.
 *
 * opossum liga la función protegida al breaker en el constructor, por eso
 * el breaker se crea una sola vez por key (en el primer `run`) y se reutiliza
 * en llamadas siguientes — no se puede sustituir la función en cada `fire()`.
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly breakers = new Map<string, CircuitBreaker>();

  async run<T>(key: string, action: () => Promise<T>): Promise<T> {
    const breaker = this.getOrCreateBreaker(key, action);
    return breaker.fire() as Promise<T>;
  }

  getState(key: string): CircuitState {
    const breaker = this.breakers.get(key);
    if (!breaker) return 'UNKNOWN';
    if (breaker.opened) return 'OPEN';
    if (breaker.halfOpen) return 'HALF_OPEN';
    return 'CLOSED';
  }

  private getOrCreateBreaker<T>(
    key: string,
    action: () => Promise<T>,
  ): CircuitBreaker {
    const existing = this.breakers.get(key);
    if (existing) return existing;

    const breaker = new CircuitBreaker(action, CIRCUIT_BREAKER_OPTIONS);
    breaker.on('open', () => this.logger.warn(`Circuit OPEN: ${key}`));
    breaker.on('halfOpen', () => this.logger.warn(`Circuit HALF-OPEN: ${key}`));
    breaker.on('close', () => this.logger.log(`Circuit CLOSED: ${key}`));
    this.breakers.set(key, breaker);
    return breaker;
  }
}
