import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
let FlightsController = class FlightsController {
    constructor(flightsService) {
        this.flightsService = flightsService;
    }
    searchFlights(searchDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.flightsService.searchFlights(searchDto);
        });
    }
    getPopularRoutes() {
        return __awaiter(this, arguments, void 0, function* (limit = '10') {
            return yield this.flightsService.getPopularRoutes(parseInt(limit));
        });
    }
    getFlightById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.flightsService.getFlightById(id);
        });
    }
    getPriceHistory(origin_1, destination_1) {
        return __awaiter(this, arguments, void 0, function* (origin, destination, days = '30') {
            return yield this.flightsService.getFlightPriceHistory(origin, destination, parseInt(days));
        });
    }
};
__decorate([
    Get('search'),
    ApiOperation({ summary: 'Search for flights' }),
    ApiResponse({ status: 200, description: 'Returns flight search results' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchFlightsDto]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "searchFlights", null);
__decorate([
    Get('popular-routes'),
    ApiOperation({ summary: 'Get popular flight routes' }),
    ApiResponse({ status: 200, description: 'Returns popular routes' }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getPopularRoutes", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get flight by ID' }),
    ApiResponse({ status: 200, description: 'Returns flight details' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getFlightById", null);
__decorate([
    Get(':origin/:destination/price-history'),
    ApiOperation({ summary: 'Get price history for a route' }),
    ApiResponse({ status: 200, description: 'Returns price history data' }),
    __param(0, Param('origin')),
    __param(1, Param('destination')),
    __param(2, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FlightsController.prototype, "getPriceHistory", null);
FlightsController = __decorate([
    ApiTags('flights'),
    Controller('flights'),
    __metadata("design:paramtypes", [FlightsService])
], FlightsController);
export { FlightsController };
