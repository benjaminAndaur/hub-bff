import type CircuitBreaker from 'opossum';

export const CIRCUIT_BREAKER_OPTIONS: CircuitBreaker.Options = {
  timeout: Number(process.env.CB_TIMEOUT_MS ?? 3000),
  errorThresholdPercentage: Number(
    process.env.CB_ERROR_THRESHOLD_PERCENTAGE ?? 50,
  ),
  resetTimeout: Number(process.env.CB_RESET_TIMEOUT_MS ?? 10000),
  rollingCountTimeout: 10000,
  rollingCountBuckets: 10,
};
