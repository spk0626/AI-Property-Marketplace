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
      imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  for (const property of properties) {
    const { imageUrl, ...propertyData } = property;

    await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: [
            {
              url: imageUrl,
              publicId: `seeder_image_${property.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
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
