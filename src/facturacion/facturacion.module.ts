import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: Number(process.env.HTTP_TIMEOUT_MS ?? 5000),
    }),
  ],
  providers: [FacturacionService],
  exports: [FacturacionService],
})
export class FacturacionModule {}
