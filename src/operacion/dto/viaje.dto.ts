import { ApiProperty } from '@nestjs/swagger';

export class ViajeDto {
  @ApiProperty() id: number;
  @ApiProperty() fecha: string;
  @ApiProperty() estado: string;
  @ApiProperty() tipo_operativo: string;
  @ApiProperty() conductor_nombre: string;
  @ApiProperty() tracto_patente: string;
  @ApiProperty() rampla_patente: string;
  @ApiProperty() cliente_nombre: string;
  @ApiProperty() servicio: string;
  @ApiProperty({ nullable: true }) fecha_carga: string | null;
  @ApiProperty() origen: string;
  @ApiProperty({ nullable: true }) fecha_descarga: string | null;
  @ApiProperty() destino: string;
  @ApiProperty() valor_viaje: number;
  @ApiProperty({ nullable: true }) observaciones: string | null;
  @ApiProperty() pernoctacion: boolean;
}
