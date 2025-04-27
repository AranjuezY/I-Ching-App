import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

interface TuanTextEntry {
  title: string;
  fulltext: string[];
}

interface TuanTexts {
  [key: string]: TuanTextEntry;
}

async function seedTuanTexts() {
  try {
    const filePath = path.join(__dirname, '../data/tuan_text_traditional.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const tuanTexts: TuanTexts = JSON.parse(data);

    for (const [hexagramKey, entry] of Object.entries(tuanTexts)) {
      const hexagram = await prisma.hexagrams.findFirst({
        where: { hexagram_name: entry.title }
      });

      if (!hexagram) {
        console.warn(`Hexagram not found: ${hexagramKey}`);
        continue;
      }

      const idQuery = await prisma.$queryRaw`SELECT MAX(id)+1 FROM texts`;

      const id = idQuery[0]['?column?'];
      console.log(`relation: ${id}, ${hexagram.id}`);

      await prisma.$queryRaw`
        INSERT INTO texts (id, source, section, content)
        VALUES (${id}, '象傳', ${entry.title}, ${entry.fulltext.join(' ')})
      `;


      await prisma.$queryRaw`
        INSERT INTO text_hexagram_links (id, text_id, hexagram_id)
        VALUES (${id}, ${id}, ${hexagram.id})
      `;
    }

    console.log('Finished seeding tuan texts.');
  } catch (error) {
    console.error('Error reading or processing tuan_text_traditional.json:', error);
    throw error;
  }
}

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
  console.log('Start seeding...');
  await seedTuanTexts();
  // await seedTranslations();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
