import { __decorate, __metadata } from "tslib";
import { IsString, IsDateString, IsNumber, IsOptional, IsEnum, Min, Max, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export var CabinClass;
(function (CabinClass) {
    CabinClass["ECONOMY"] = "economy";
    CabinClass["PREMIUM_ECONOMY"] = "premium_economy";
    CabinClass["BUSINESS"] = "business";
    CabinClass["FIRST"] = "first";
})(CabinClass || (CabinClass = {}));
export class SearchFlightsDto {
    constructor() {
        this.passengers = 1;
        this.cabin = CabinClass.ECONOMY;
        this.limit = 20;
        this.offset = 0;
    }
}
__decorate([
    ApiProperty({ example: 'LAX', description: 'Origin airport code' }),
    IsString(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "origin", void 0);
__decorate([
    ApiProperty({ example: 'JFK', description: 'Destination airport code' }),
    IsString(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "destination", void 0);
__decorate([
    ApiProperty({ example: '2024-12-25', description: 'Departure date' }),
    IsDateString(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "departureDate", void 0);
__decorate([
    ApiPropertyOptional({
        example: '2024-12-30',
        description: 'Return date for round trip',
    }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "returnDate", void 0);
__decorate([
    ApiPropertyOptional({
        example: 2,
        description: 'Number of passengers',
        minimum: 1,
        maximum: 9,
    }),
    IsOptional(),
    IsNumber(),
    Min(1),
    Max(9),
    __metadata("design:type", Number)
], SearchFlightsDto.prototype, "passengers", void 0);
__decorate([
    ApiPropertyOptional({ enum: CabinClass, description: 'Cabin class' }),
    IsOptional(),
    IsEnum(CabinClass),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "cabin", void 0);
__decorate([
    ApiPropertyOptional({
        example: 2,
        description: 'Maximum number of stops',
        minimum: 0,
    }),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], SearchFlightsDto.prototype, "maxStops", void 0);
__decorate([
    ApiPropertyOptional({
        example: 1000,
        description: 'Maximum price',
        minimum: 0,
    }),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], SearchFlightsDto.prototype, "maxPrice", void 0);
__decorate([
    ApiPropertyOptional({
        example: ['UA', 'AA'],
        description: 'Preferred airlines',
    }),
    IsOptional(),
    __metadata("design:type", Array)
], SearchFlightsDto.prototype, "airlines", void 0);
__decorate([
    ApiPropertyOptional({
        example: 20,
        description: 'Number of results per page',
        minimum: 1,
        maximum: 100,
    }),
    IsOptional(),
    IsNumber(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], SearchFlightsDto.prototype, "limit", void 0);
__decorate([
    ApiPropertyOptional({
        example: 0,
        description: 'Offset for pagination',
        minimum: 0,
    }),
    IsOptional(),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], SearchFlightsDto.prototype, "offset", void 0);
