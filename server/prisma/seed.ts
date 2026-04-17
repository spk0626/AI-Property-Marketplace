import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});

async function main() {
  console.log('Seeding database...');

  // Create an owner
  const ownerPassword = await bcrypt.hash('password123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Test Owner',
      passwordHash: ownerPassword,
      role: 'OWNER',
    },
  });

  // Create a buyer
  const buyerPassword = await bcrypt.hash('password123', 10);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Test Buyer',
      passwordHash: buyerPassword,
      role: 'BUYER',
    },
  });

  // Create some properties
  const properties = [
    {
      title: 'Modern Apartment in City Center',
      description: 'A beautiful and modern apartment located in the heart of the city with great views.',
      price: 85000,
      location: 'Colombo 03',
      bedrooms: 2,
      bathrooms: 2,
      parking: true,
      area: 950,
      ownerId: owner.id,
    },
    {
      title: 'Luxury Beachfront Villa',
      description: 'Stunning villa with direct beach access, private pool, and spacious garden.',
      price: 250000,
      location: 'Mount Lavinia',
      bedrooms: 4,
      bathrooms: 3,
      parking: true,
      area: 3200,
      ownerId: owner.id,
    },
    {
      title: 'Cozy Suburb Home',
      description: 'Perfect family home located in a quiet neighborhood with a large backyard.',
      price: 45000,
      location: 'Maharagama',
      bedrooms: 3,
      bathrooms: 1,
      parking: false,
      area: 1200,
      ownerId: owner.id,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
              publicId: 'seeder_image_1'
            }
          ]
        }
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
