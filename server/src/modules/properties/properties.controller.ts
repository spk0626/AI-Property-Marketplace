import {
    Controller, Get, Post, Put, Delete, Body, Param, 
    Query, UseGuards, UseInterceptors, UploadedFile,
    HttpCode, ParseUUIDPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertiesDto } from './dto/filter-properties.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from '../auth/auth.decorator';
import type { JwtUser } from 'src/common/interfaces/jwt-user.interface';

@Controller('properties')
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) {}

    @Get()
    findAll(@Query() filters: FilterPropertiesDto) {
        return this.propertiesService.findAll(filters);
    }
    // inputs: filters (FilterPropertiesDto)
    // outputs: result of propertiesService.findAll which returns a list of properties matching the filters along with pagination metadata

    @Get('owner/my')
    @UseGuards(JwtAuthGuard)
    getMyProperties(@CurrentUser() user: JwtUser) {
        return this.propertiesService.findByOwner(user.id);
    }
    // inputs: current authenticated user (JwtUser)
    // outputs: result of propertiesService.findByOwner which returns a list of properties owned by the authenticated user

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.propertiesService.findOne(id);
    }
    // inputs: property id 
    // outputs: result of propertiesService.findOne which returns the details of a single property by its id

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER', 'ADMIN')
    create(@CurrentUser() user: JwtUser, @Body() dto: CreatePropertyDto) {
        return this.propertiesService.create(user.id, dto);
    }
    // inputs: current authenticated user (JwtUser) and CreatePropertyDto
    // outputs: result of propertiesService.create which creates a new property associated with the authenticated user and returns the created property details

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER', 'ADMIN')
    Update(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtUser,
        @Body() dto: UpdatePropertyDto,
    ) {
        return this.propertiesService.update(id, user.id, dto);
    }
    // inputs: property id, current authenticated user (JwtUser), and UpdatePropertyDto
    // outputs: result of propertiesService.update which updates the specified property if the authenticated user is the owner or an admin and returns the updated property details
    
    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER', 'ADMIN')
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtUser,
    ) {
        return this.propertiesService.remove(id, user.id);
    }
    // inputs: property id and current authenticated user (JwtUser)
    // outputs: result of propertiesService.remove which deletes the specified property if the authenticated user is the owner or an admin and returns no content (204 status code)
    

    @Post(':id/images')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('OWNER', 'ADMIN')
    @UseInterceptors(                 // @Interceptors is used to handle file uploads
        FileInterceptor('image', {            // FileInterceptor is configured to expect a single file with the field name 'image'
            storage: memoryStorage(),                                // uploaded file will be stored in memory as a Buffer, rather than being saved to disk. This is useful for processing the file directly in the application (e.g., uploading to Cloudinary) without needing to manage temporary files on the server.
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
            fileFilter: (_req, file, cb) => {                            // fileFilter is a function that checks the MIME type of the uploaded file against a list of allowed types (JPEG, PNG, WEBP)
                const allowed = ['image/jpeg', 'image/png', 'image/webp'];  //request object(_req), uploaded file object(file), a callback function(cb) that should be called with either an error or a boolean indicating whether the file is accepted
                if (allowed.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only JPEG, PNG, and WEBP images are allowed'), false);
                }
            }
        }),
    )

    uploadImage(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtUser,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.propertiesService.uploadImage(id, user.id, file);
    }
    // inputs: property id, current authenticated user (JwtUser), and uploaded image file
    // outputs: result of propertiesService.uploadImage which uploads the image to Cloudinary, associates it with the specified property if the authenticated user is the owner or an admin, and returns the details of the uploaded image

}
