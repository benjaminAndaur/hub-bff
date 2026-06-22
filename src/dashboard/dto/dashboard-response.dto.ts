import { ApiProperty } from '@nestjs/swagger';
import { FacturaDto } from '../../facturacion/dto/factura.dto';
import { ViajeDto } from '../../operacion/dto/viaje.dto';

export type DependencyStatus = 'ok' | 'degraded';

export class DashboardMetaDto {
  @ApiProperty({ enum: ['ok', 'degraded'] })
  viajes_status: DependencyStatus;

  @ApiProperty({ enum: ['ok', 'degraded'] })
  facturacion_status: DependencyStatus;
}

export class DashboardResponseDto {
  @ApiProperty({ type: [ViajeDto] })
  viajes: ViajeDto[];

  @ApiProperty({ type: [FacturaDto] })
  facturacion: FacturaDto[];

  @ApiProperty({ type: DashboardMetaDto })
  meta: DashboardMetaDto;
}
