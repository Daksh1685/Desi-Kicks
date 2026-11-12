import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = 'https://craftyoursole.in';
const today = new Date().toISOString().split('T')[0];

function extractMatches(filePath, regex) {
  const content = fs.readFileSync(path.join(rootDir, filePath), 'utf8');
  const results = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1] && !results.includes(match[1])) {
      results.push(match[1]);
    }
  }
  return results;
}

const collectionSlugs = extractMatches(
  'src/constants/site.ts',
  /slug:\s*'([a-z0-9-]+)'/g
);

const productSlugs = extractMatches(
  'src/context/ProductContext.tsx',
  /slug:\s*'([a-z0-9-]+)'/g
);

const urls = [
  { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_URL}/collections`, changefreq: 'weekly', priority: '0.9' },
  ...collectionSlugs.map((slug) => ({
    loc: `${SITE_URL}/collections/${slug}`,
    changefreq: 'weekly',
    priority: '0.85',
  })),
  ...productSlugs.map((slug) => ({
    loc: `${SITE_URL}/products/${slug}`,
    changefreq: 'weekly',
    priority: '0.9',
  })),
  { loc: `${SITE_URL}/size-guide`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/authenticity`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/shipping-policy`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/returns-exchange`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/privacy-policy`, changefreq: 'yearly', priority: '0.4' },
  { loc: `${SITE_URL}/terms`, changefreq: 'yearly', priority: '0.4' },
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(
    (entry) =>
      `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

const outPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Generated ${outPath} with ${urls.length} URLs.`);

