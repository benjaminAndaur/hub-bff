import { Module } from '@nestjs/common';
import { FacturacionModule } from '../facturacion/facturacion.module';
import { OperacionModule } from '../operacion/operacion.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [OperacionModule, FacturacionModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
