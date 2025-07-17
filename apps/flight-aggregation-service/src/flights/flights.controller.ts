import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for flights' })
  @ApiResponse({ status: 200, description: 'Returns flight search results' })
  async searchFlights(@Query() searchDto: SearchFlightsDto) {
    return await this.flightsService.searchFlights(searchDto);
  }

  @Get('popular-routes')
  @ApiOperation({ summary: 'Get popular flight routes' })
  @ApiResponse({ status: 200, description: 'Returns popular routes' })
  async getPopularRoutes(@Query('limit') limit: string = '10') {
    return await this.flightsService.getPopularRoutes(parseInt(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flight by ID' })
  @ApiResponse({ status: 200, description: 'Returns flight details' })
  async getFlightById(@Param('id') id: string) {
    return await this.flightsService.getFlightById(id);
  }

  @Get(':origin/:destination/price-history')
  @ApiOperation({ summary: 'Get price history for a route' })
  @ApiResponse({ status: 200, description: 'Returns price history data' })
  async getPriceHistory(
    @Param('origin') origin: string,
    @Param('destination') destination: string,
    @Query('days') days: string = '30'
  ) {
    return await this.flightsService.getFlightPriceHistory(
      origin,
      destination,
      parseInt(days)
    );
  }
}
