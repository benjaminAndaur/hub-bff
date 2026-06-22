import { ApiProperty } from '@nestjs/swagger';

export class FacturaDto {
  @ApiProperty() id: number;
  @ApiProperty() cliente: string;
  @ApiProperty() fecha: string;
  @ApiProperty() total: number;
  @ApiProperty() estado: string;
}
