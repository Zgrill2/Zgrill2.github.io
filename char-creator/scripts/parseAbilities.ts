import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

interface AbilityRow {
  Category: string;
  'Ability Name': string;
  'Ability Description': string;
  'Rules Text': string;
  'BP Cost': string | number;
  'Affinity req': string;
  W?: number;
  U?: number;
  B?: number;
  R?: number;
  G?: number;
}

interface Ability {
  category: string;
  name: string;
  description: string;
  rulesText: string;
  bpCost: number | number[];
  affinityReq: string;
  colorContributions: {
    w: number;
    u: number;
    b: number;
    r: number;
    g: number;
  };
}

function parseBPCost(cost: string | number): number | number[] {
  if (typeof cost === 'number') {
    return cost;
  }

  const costStr = String(cost).trim();

  // Check if it's a multi-rank cost like "60/70/80" or "20/30/40"
  if (costStr.includes('/')) {
    return costStr.split('/').map(c => parseInt(c.trim(), 10));
  }

  return parseInt(costStr, 10) || 0;
}

function parseExcel() {
  const excelPath = path.join(process.cwd(), 'Shimmering Reach - Character Creator.xlsx');

  console.log('Reading Excel file:', excelPath);
  const workbook = XLSX.readFile(excelPath);

  console.log('Available sheets:', workbook.SheetNames);

  // Find the abilities sheet (might be named "Abilities", "Ability List", etc.)
  const abilitiesSheetName = workbook.SheetNames.find(name =>
    name.toLowerCase().includes('abilit')
  );

  if (!abilitiesSheetName) {
    throw new Error('Could not find abilities sheet in Excel file');
  }

  console.log('Using sheet:', abilitiesSheetName);
  const worksheet = workbook.Sheets[abilitiesSheetName];

  // Headers are in row 1 (index 1), data starts at row 2
  const rawData: AbilityRow[] = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

  console.log(`Found ${rawData.length} abilities`);

  // Transform data
  const abilities: Ability[] = rawData.map((row) => ({
    category: String(row.Category || '').trim(),
    name: String(row['Ability Name'] || '').trim(),
    description: String(row['Ability Description'] || '').trim(),
    rulesText: String(row['Rules Text'] || '').trim(),
    bpCost: parseBPCost(row['BP Cost']),
    affinityReq: String(row['Affinity req'] || '').trim(),
    colorContributions: {
      w: Number(row.W || 0),
      u: Number(row.U || 0),
      b: Number(row.B || 0),
      r: Number(row.R || 0),
      g: Number(row.G || 0),
    },
  }));

  // Filter out empty rows
  const validAbilities = abilities.filter(a => a.name && a.category);

  console.log(`Valid abilities: ${validAbilities.length}`);

  // Write to JSON file
  const outputPath = path.join(process.cwd(), 'src', 'data', 'abilities.json');
  fs.writeFileSync(outputPath, JSON.stringify(validAbilities, null, 2));

  console.log('Abilities written to:', outputPath);

  // Print some statistics
  const categories = new Set(validAbilities.map(a => a.category));
  console.log('\nCategories found:', Array.from(categories).sort());

  // Sample first 3 abilities
  console.log('\nSample abilities:');
  validAbilities.slice(0, 3).forEach(a => {
    console.log(`- ${a.name} (${a.category}) - ${a.bpCost} BP`);
  });
}

parseExcel();
