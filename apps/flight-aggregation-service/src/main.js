import { __awaiter } from "tslib";
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield NestFactory.create(AppModule);
        // Enable CORS for frontend
        app.enableCors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        });
        // Global validation pipe
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        // Swagger documentation
        const config = new DocumentBuilder()
            .setTitle('SkyScout Flight Aggregation API')
            .setDescription('Real-time flight data aggregation and search service')
            .setVersion('1.0')
            .addTag('flights')
            .addTag('airlines')
            .addTag('airports')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
        const port = process.env.PORT || 3001;
        yield app.listen(port);
        console.log(`🚀 Flight Aggregation Service running on port ${port}`);
        console.log(`📚 API Documentation: http://localhost:${port}/api`);
    });
}
bootstrap();
