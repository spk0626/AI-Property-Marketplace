import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
    controllers: [HealthController],
})
export class HealthModule {}

// What this module does:
// - It defines a NestJS module called HealthModule.
// - It imports the HealthController, which contains two endpoints: /health and /metrics.
// - The /health endpoint returns a simple status message and timestamp to indicate the server is running.
// - The /metrics endpoint returns uptime and memory usage information for monitoring purposes, including heapUsed, heapTotal, and rss (Resident Set Size).