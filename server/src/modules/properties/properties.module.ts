import { Module } from "@nestjs/common";
import { PropertiesController } from "./properties.controller";
import { PropertiesService } from "./properties.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],                     // to use authentication features like guards and decorators for protecting routes and accessing the current authenticated user
    controllers: [PropertiesController],
    providers: [PropertiesService],
    exports: [PropertiesService],
})
export class PropertiesModule {}


// 1. imports the AuthModule to leverage authentication features
// 2. declares the PropertiesController for handling HTTP requests related to properties
// 3. provides the PropertiesService for business logic related to properties
// 4. exports the PropertiesService so it can be used in other modules if needed