import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedTranslations() {
  try {
    const filePath = path.join(__dirname, '../data/results.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const translations = JSON.parse(data).data;

    for (const key in translations) {
      const text = translations[key];
      const textId = parseInt(key) + 1; // Convert array index to text ID (assuming 1-based IDs)

      await prisma.texts.update({
        where: { id: textId },
        data: { translation: text }
      });
    }

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
