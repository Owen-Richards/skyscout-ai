import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { FlightsModule } from './flights/flights.module';
import { AirlinesModule } from './airlines/airlines.module';
import { AirportsModule } from './airports/airports.module';
import { AggregationModule } from './aggregation/aggregation.module';
import { WebSocketModule } from './websocket/websocket.module';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            // Configuration
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            // Database
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_NAME || 'skyscout_flights',
                autoLoadEntities: true,
                synchronize: process.env.NODE_ENV === 'development',
            }),
            // Redis Cache
            CacheModule.register({
                isGlobal: true,
                store: redisStore,
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
                ttl: 300, // 5 minutes default TTL
            }),
            // Queue Management
            BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                    password: process.env.REDIS_PASSWORD,
                },
            }),
            // Scheduled Tasks
            ScheduleModule.forRoot(),
            // Feature Modules
            FlightsModule,
            AirlinesModule,
            AirportsModule,
            AggregationModule,
            WebSocketModule,
        ],
    })
], AppModule);
export { AppModule };
