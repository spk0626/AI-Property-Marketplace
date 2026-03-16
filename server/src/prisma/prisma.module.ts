import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // This decorator makes the PrismaService available globally across the entire application, so don't need to import PrismaModule in every module that needs to use PrismaService.
@Module({
    providers: [PrismaService],  // allows PrismaService to be injected into other parts of the application
    exports: [PrismaService],  // makes PrismaService available for import in other modules
})
export class PrismaModule {}

// Summary of module:
// - It defines a NestJS module called PrismaModule.
// - It imports the PrismaService, which extends the PrismaClient and implements lifecycle hooks to manage database connections.
// - The PrismaService is made available globally across the application, so it can be injected into any other module without needing to import PrismaModule in each one.