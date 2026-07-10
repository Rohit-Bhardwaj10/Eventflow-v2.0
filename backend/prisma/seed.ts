import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// @ts-ignore
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create a College
  const college = await prisma.college.upsert({
    where: { domain: 'example.edu' },
    update: {},
    create: {
      name: 'Example University',
      domain: 'example.edu',
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80',
    },
  });

  // 2. Create Users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.edu' },
    update: {},
    create: {
      authId: 'auth_admin_1',
      email: 'admin@example.edu',
      name: 'College Admin',
      role: 'COLLEGE_ADMIN',
      collegeId: college.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'student1@example.edu' },
    update: {},
    create: {
      authId: 'auth_student_1',
      email: 'student1@example.edu',
      name: 'Alice Smith',
      role: 'STUDENT',
      collegeId: college.id,
      year: 2,
    },
  });

  // 3. Create Clubs
  const club1 = await prisma.club.upsert({
    where: { slug: 'tech-club' },
    update: {},
    create: {
      slug: 'tech-club',
      name: 'Tech Innovators',
      tagline: 'Building the future',
      category: 'TECH',
      bio: 'We are a group of tech enthusiasts building cool things.',
      status: 'APPROVED',
      isVerified: true,
      collegeId: college.id,
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    },
  });

  const club2 = await prisma.club.upsert({
    where: { slug: 'cultural-society' },
    update: {},
    create: {
      slug: 'cultural-society',
      name: 'Cultural Society',
      tagline: 'Celebrating diversity',
      category: 'CULTURAL',
      bio: 'Promoting art, music, and culture on campus.',
      status: 'APPROVED',
      isVerified: true,
      collegeId: college.id,
      logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    },
  });

  // 4. Create Events
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const event1 = await prisma.event.upsert({
    where: { slug: 'hackathon-2026' },
    update: {},
    create: {
      title: 'Annual Hackathon 2026',
      slug: 'hackathon-2026',
      description: 'Join us for a 24-hour coding marathon. Build amazing projects and win prizes!',
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      startAt: tomorrow,
      endAt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), // 24 hours later
      venue: 'Main Auditorium',
      capacity: 200,
      clubId: club1.id,
      createdById: user1.id,
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    },
  });

  const event2 = await prisma.event.upsert({
    where: { slug: 'cultural-night' },
    update: {},
    create: {
      title: 'Cultural Night Gala',
      slug: 'cultural-night',
      description: 'An evening of music, dance, and celebration.',
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      startAt: nextWeek,
      endAt: new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
      venue: 'Open Air Theatre',
      capacity: 500,
      clubId: club2.id,
      createdById: user1.id,
      coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
    },
  });

  // 5. Create Ticket Tiers
  await prisma.ticketTier.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'General Admission',
        eventId: event1.id,
        price: 0,
        capacity: 150,
        available: 150,
      },
      {
        name: 'VIP',
        eventId: event1.id,
        price: 50,
        capacity: 50,
        available: 50,
      },
      {
        name: 'Free Entry',
        eventId: event2.id,
        price: 0,
        capacity: 500,
        available: 500,
      }
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
