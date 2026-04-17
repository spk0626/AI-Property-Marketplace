/*
  Warnings:

  - Added the required column `public_id` to the `property_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "property_images" DROP CONSTRAINT "property_images_property_id_fkey";

-- AlterTable
ALTER TABLE "property_images" ADD COLUMN     "public_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_property_id_idx" ON "bookings"("property_id");

-- CreateIndex
CREATE INDEX "properties_owner_id_idx" ON "properties"("owner_id");

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
