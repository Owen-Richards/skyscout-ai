import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { Flight } from './entities/flight.entity';
let FlightsModule = class FlightsModule {
};
FlightsModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Flight])],
        controllers: [FlightsController],
        providers: [FlightsService],
        exports: [FlightsService],
    })
], FlightsModule);
export { FlightsModule };
