import { from } from "rxjs";
import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { UpdatePropertyDto } from "./dto/update-property.dto";
import { FilterPropertiesDto } from "./dto/filter-properties.dto";

@Injectable()
export class PropertiesService {
    private readonly logger = new Logger(PropertiesService.name);

    constructor(
        private readonly prisma: PrismaService,
        config: ConfigService,
    ) {
        cloudinary.config({
            cloud_name: config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: config.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
        });
    }
    // 1. initializes the PrismaService for database interactions
    // 2. configures Cloudinary using environment variables for handling image uploads


    /* Queries */
    async findAll(filters: FilterPropertiesDto) {
        const where = this.buildWhereClause(filters);  // builds a Prisma where clause based on the provided filters
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;

        const [properties, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                include: {
                    images: true,
                    owner: { select: { name: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.property.count({ where }),
        ]);
        return { properties, total, page, totalPages: Math.ceil(total / limit) };
    }
    // inputs: FilterPropertiesDto -> contains optional filters for location, price range, bedrooms, parking, and pagination parameters (page and limit).
    // process: builds a Prisma where clause, retrieves a paginated list from the database that match the filters, and counts the total number of matching properties for pagination metadata.
    // output: a list of properties, total count of matching properties, current page, and total pages for pagination.

    
    async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        owner: { select: { name: true, email: true } },
      },
    });

    if (!property) throw new NotFoundException('Property not found');
    return property;
  }
    // inputs: id of the property
    // process: queries the database for a property with the specified ID, including related images and owner information. If the property does not exist, it throws a NotFoundException.
    // output: the property with its images and owner details if found; otherwise, an error is thrown.  


    async findByOwner(ownerId: string) {
        return this.prisma.property.findMany({
            where: { ownerId },
            include: { 
                images: true,
                bookings: {select: { status: true, visitDate: true }},
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    // inputs: ownerId 
    // process: queries the database for properties that belong to the specified owner, including related images and booking information, and orders them by creation date.
    // output: a list of properties owned by the specified user, with its images and booking details.

    

    /* Mutations */
    async create(ownerId: string, dto: CreatePropertyDto) {
        const property = await this.prisma.property.create({
            data: { ...dto, ownerId },
            include: { images: true },
        });
        this.logger.log(`Property created with ID: ${property.id} by User: ${ownerId}`);
        return property;
    }
    // inputs: ownerId and CreatePropertyDto
    // process: creates a new property in the database with the provided details and ownerId, and includes any related images in the response. It also logs the creation event.
    // output: the newly created property, including images


    async update(id: string, ownerId: string, dto: UpdatePropertyDto) {
        await this.assertOwnership(id, ownerId);
        return this.prisma.property.update({
            where: { id },
            data: dto,
            include: { images: true },
        });
    }
    // inputs: id, ownerId, and UpdatePropertyDto
    // process: asserts ownership. Updates an existing property in the database with the provided details and ownerId, and includes any related images in the response
    // output: the updated property, including images


    async remove(id: string, ownerId: string): Promise<void> {
        const property = await this.assertOwnership(id, ownerId);

        // Delete from cloudinary first to avoid orphaned images if DB deletion fails
        await Promise.all(
            property.images.map((img) =>
                cloudinary.uploader.destroy(img.publicId).catch((err: Error) => 
                    this.logger.warn(
                        `Cloudinary delete failed for ${img.publicId}: ${err.message}`,
                    ),
                ),
            ),
        );
        await this.prisma.property.delete({where: { id}});
        this.logger.log(`Property deleted: ${id}`);
    }
    // inputs: id and ownerId
    // process: asserts ownership, deletes all associated images from Cloudinary, and then deletes the property from the database
    // output: void 


    async uploadImage(
        propertyId: string,
        ownerId: string,
        file: Express.Multer.File,
    ) {
        await this.assertOwnership(propertyId, ownerId);

        const uploaded = await new Promise<{   // uploaded: a Promise that resolves to an object containing the secure URL and public ID of the uploaded image on Cloudinary
            secure_url: string;
            public_id: string;
        }>((resolve, reject) => {   
            cloudinary.uploader      // uploads the image file to Cloudinary, specifying the folder and resource type. It uses a Promise to handle the asynchronous upload process, resolving with the uploaded image's secure URL and public ID, or rejecting with an error if the upload fails.
            .upload_stream(
                { folder: 'property-marketplace', resource_type: 'image' },
                (err, result) => {
                    if (err ?? !result) return reject(err);
                    resolve(result as { secure_url: string; public_id: string });
                },
            )
            .end(file.buffer);
        });

        return this.prisma.propertyImage.create({
            data: {
                propertyId,
                url: uploaded.secure_url,
                publicId: uploaded.public_id,
            },
        });
    }
    // inputs: propertyId, ownerId, and file
    // process: asserts ownership, uploads the image file to Cloudinary, and then creates a new record in the database linking the uploaded image to the property
    // output: the newly created property image record in the database, which includes the URL and public ID of the uploaded image on Cloudinary



    /* Private */
    private buildWhereClause(
        filters: FilterPropertiesDto,
    ): Prisma.PropertyWhereInput {
        const where: Prisma.PropertyWhereInput = {};

        if (filters.location) {
            where.location = { contains: filters.location, mode: 'insensitive' };
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {
                ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
                ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
            };
        }
        if (filters.bedrooms !== undefined) where.bedrooms = filters.bedrooms;
        if (filters.parking !== undefined) {
            where.parking = filters.parking === 'true';
        }
        return where;
    }
    // inputs: FilterPropertiesDto
    // process: constructs a Prisma 'where clause' based on the provided filters for location, price range, bedrooms, and parking. It handles optional filters and builds a dynamic query object that can be used to filter properties in the database.
    // output: a Prisma.PropertyWhereInput object that represents the filtering criteria for querying


    private async assertOwnership(propertyId: string, ownerId: string) {
        const property = await this.prisma.property.findUnique({
            where: { id: propertyId },
            include: { images: true },
        });

        if (!property) throw new NotFoundException('Property not found');
        if (property.ownerId !== ownerId) {
            throw new ForbiddenException(
                'You do not have permission to modify this property',
            );
        }
        return property;
    }
    // inputs: propertyId and ownerId
    // process: checks if a property with the given ID exists and if it belongs to the specified owner. If the property does not exist, it throws a NotFoundException. If the property exists but does not belong to the owner, it throws a ForbiddenException. If both checks pass, it returns the property.
    // output: the property if ownership is confirmed; otherwise, it throws an appropriate exception.

}
           




