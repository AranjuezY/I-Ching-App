import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedTranslations() {
  try {
    const resultsPath = path.join(__dirname, '../data/results.json');
    const resultsBuffer = await fs.readFile(resultsPath, 'utf-8');
    const translationsData: { [key: string]: string[] } = JSON.parse(resultsBuffer);

    console.log('Finished seeding translations.');
  } catch (error) {
    console.error('Error reading or processing results.json:', error);
  }
}

async function main() {
  console.log('Start seeding translations...');
  await seedTranslations();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});