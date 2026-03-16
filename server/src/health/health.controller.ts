import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
    @Get('health')
    health() {
        return {
            status: 'ok',
                timestamp: new Date().toISOString(),
        };
    }

    @Get('metrics')
    metrics() {
        const mem = process.memoryUsage();
        return {
            uptime: Math.floor(process.uptime()),
            memory: {
                heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,  // Convert bytes to MB for readability
                heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`, 
                rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
            },
            timestamp: new Date().toISOString(),
        };
    }
}

// This controller provides two endpoints:
// GET /health - returns a simple status message and timestamp to indicate the server is running
// GET /metrics - returns uptime and memory usage information for monitoring purposes

// heapUsed: the amount of memory currently being used by the application
// heapTotal: the total amount of memory allocated for the application
// rss (Resident Set Size): the total memory allocated for the process, including code, stack, and heap.