import { Controller, Get, Headers } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check público del BFF' })
  health() {
    return { status: 'ok', service: 'bff' };
  }

  @Get('dashboard')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Agrega viajes (Operación) + facturas (Facturación)',
  })
  @ApiOkResponse({ type: DashboardResponseDto })
  async getDashboard(
    @Headers('authorization') authorization: string,
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(authorization);
  }
}
