import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OperacionService } from './operacion.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: Number(process.env.HTTP_TIMEOUT_MS ?? 5000),
    }),
  ],
  providers: [OperacionService],
  exports: [OperacionService],
})
export class OperacionModule {}
