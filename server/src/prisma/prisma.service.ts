import { 
    Injectable, 
    OnModuleDestroy, 
    OnModuleInit,
    Logger 
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);  // logger: used to log important events related to the PrismaService, such as successful connection or disconnection from the database.
  
    async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}

// Using Promise ensures that the database connection is established before the application starts handling requests, and that the connection is properly closed when the application shuts down.
// Return type Promise<void>: these methods perform asynchronous operations (like connecting to or disconnecting from the database) and do not return any value when they complete.