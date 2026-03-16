import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

// Extends CreatePropertyDto using PartialType: 
// makes all properties optional. 
// This allows us to use the same validation rules defined in CreatePropertyDto while only requiring the fields that need to be updated when making a PATCH request to update a property.

// properties eg: title, description, price, location, bedrooms, bathrooms, parking, area - all optional for update, but if provided, must follow the same validation rules as in CreatePropertyDto.