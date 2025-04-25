import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedTranslations() {
  try {
    // const filePath = path.join(__dirname, '../data/results.json');
    // const data = await fs.readFile(filePath, 'utf-8');
    // const translations = JSON.parse(data);

    // for (const [hexagramId, lines] of Object.entries(translations)) {
    //   const hexagramNumber = parseInt(hexagramId.replace('ic', ''));
      
    //   for (const [index, text] of (lines as string[]).entries()) {
    //     await prisma.texts.create({
    //       data: {
    //         translation: text
    //       }
    //     });
    //   }
    // }

    console.log('Finished seeding translations.');
  } catch (error) {
    console.error('Error reading or processing results.json:', error);
    throw error;
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
