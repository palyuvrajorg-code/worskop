import fs from 'fs';

const inputData = JSON.parse(fs.readFileSync('/Users/ananya_narhe/.gemini/antigravity/brain/42e2acf3-cc4d-46aa-819f-ff1936ec264e/scratch/input.json', 'utf8'));

const sectorMap = {
  "Renewable Energy": "renewable",
  "Sustainable Agriculture": "agriculture",
  "Green Buildings": "buildings",
  "Clean Transport": "transport",
  "Sustainable Forestry": "forestry"
};

const categories = Object.keys(sectorMap).map(k => ({ id: sectorMap[k], title: k }));

let totalFunding = 0;
let totalImpact = 0;

const projects = inputData.map(p => {
  const funding = p.amount_crore * 10000000;
  const impact = p.co2_avoided_tco2;
  totalFunding += funding;
  totalImpact += impact;

  // Make up some allocation ratios that sum to 100
  const green = 30 + (p.id % 4) * 10;
  const climate = 30 + (p.id % 3) * 10;
  const social = 100 - green - climate;

  return {
    id: p.id,
    name: p.project,
    category: sectorMap[p.sector],
    funding: funding,
    impact: impact,
    capacity_added_mw: p.capacity_added_mw,
    jobs_created: p.jobs_created,
    area_reforested_ha: p.area_reforested_ha,
    allocation: { green, climate, social }
  };
});

const data = {
  overview: {
    totalProjects: inputData.length,
    totalFunding: totalFunding,
    totalImpact: totalImpact,
    avgEfficiency: Number(((totalImpact / totalFunding) * 1000000).toFixed(2)) // per million
  },
  categories,
  projects
};

const output = `const data = ${JSON.stringify(data, null, 2)};\n\nexport default data;\n`;

fs.writeFileSync('/Users/ananya_narhe/Desktop/workshop/backend/data.js', output);
console.log('Done!');
