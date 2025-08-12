import { __decorate, __metadata } from "tslib";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, } from 'typeorm';
let Flight = class Flight {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Flight.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Flight.prototype, "flightNumber", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Flight.prototype, "airline", void 0);
__decorate([
    Column(),
    Index(),
    __metadata("design:type", String)
], Flight.prototype, "origin", void 0);
__decorate([
    Column(),
    Index(),
    __metadata("design:type", String)
], Flight.prototype, "destination", void 0);
__decorate([
    Column('timestamp with time zone'),
    Index(),
    __metadata("design:type", Date)
], Flight.prototype, "departureDate", void 0);
__decorate([
    Column('timestamp with time zone'),
    __metadata("design:type", Date)
], Flight.prototype, "arrivalDate", void 0);
__decorate([
    Column('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Flight.prototype, "price", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Flight.prototype, "currency", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Flight.prototype, "cabin", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], Flight.prototype, "availableSeats", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], Flight.prototype, "duration", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], Flight.prototype, "stops", void 0);
__decorate([
    Column('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], Flight.prototype, "segments", void 0);
__decorate([
    Column('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Flight.prototype, "baggage", void 0);
__decorate([
    Column('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], Flight.prototype, "amenities", void 0);
__decorate([
    Column(),
    Index(),
    __metadata("design:type", String)
], Flight.prototype, "source", void 0);
__decorate([
    Column('timestamp with time zone'),
    Index(),
    __metadata("design:type", Date)
], Flight.prototype, "lastUpdated", void 0);
__decorate([
    Column({ default: true }),
    Index(),
    __metadata("design:type", Boolean)
], Flight.prototype, "isActive", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Flight.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Flight.prototype, "updatedAt", void 0);
Flight = __decorate([
    Entity('flights'),
    Index(['origin', 'destination', 'departureDate']),
    Index(['flightNumber', 'airline'])
], Flight);
export { Flight };
