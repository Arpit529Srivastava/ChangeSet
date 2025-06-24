const fs = require('fs');
const path = require('path');

const prTitle = process.argv[2] || '';
let type = 'patch';
if (/^feat!|^fix!/.test(prTitle)) type = 'major';
else if (/^feat/.test(prTitle)) type = 'minor';
else if (/^fix/.test(prTitle)) type = 'patch';

const summary = prTitle.replace(/^(feat!|fix!|feat|fix)/, '').trim() || 'Auto-generated changeset';

const filename = `${Math.random().toString(36).substring(2, 8)}.md`;
const content = `---\n${type}: true\n---\n\n${summary}\n`;

fs.writeFileSync(path.join('.changeset', filename), content);
console.log(`Created changeset: .changeset/${filename}`); 