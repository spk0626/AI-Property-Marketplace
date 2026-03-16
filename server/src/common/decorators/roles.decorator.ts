import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';  // This constant is used as a key to store the roles metadata on the route handlers

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);  // This decorator will be used to specify which roles are allowed to access a particular route handler.