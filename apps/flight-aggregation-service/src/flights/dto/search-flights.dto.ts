import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum CabinClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

export class SearchFlightsDto {
  @ApiProperty({ example: 'LAX', description: 'Origin airport code' })
  @IsString()
  origin: string;

  @ApiProperty({ example: 'JFK', description: 'Destination airport code' })
  @IsString()
  destination: string;

  @ApiProperty({ example: '2024-12-25', description: 'Departure date' })
  @IsDateString()
  departureDate: string;

  @ApiPropertyOptional({
    example: '2024-12-30',
    description: 'Return date for round trip',
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Number of passengers',
    minimum: 1,
    maximum: 9,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(9)
  passengers?: number = 1;

  @ApiPropertyOptional({ enum: CabinClass, description: 'Cabin class' })
  @IsOptional()
  @IsEnum(CabinClass)
  cabin?: CabinClass = CabinClass.ECONOMY;

  @ApiPropertyOptional({
    example: 2,
    description: 'Maximum number of stops',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxStops?: number;

  @ApiPropertyOptional({
    example: 1000,
    description: 'Maximum price',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: ['UA', 'AA'],
    description: 'Preferred airlines',
  })
  @IsOptional()
  airlines?: string[];

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of results per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 0,
    description: 'Offset for pagination',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
