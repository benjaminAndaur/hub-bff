import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CircuitBreakerModule } from './common/circuit-breaker/circuit-breaker.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CircuitBreakerModule,
    DashboardModule,
  ],
})
export class AppModule {}
