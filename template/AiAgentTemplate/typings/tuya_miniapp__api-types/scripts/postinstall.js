const path = require('path');
const fs = require('fs');

const typeFile = path.join(__dirname, '../index.d.ts');

const typesDir = path.join(__dirname, '../../../@types/tuya-miniapp__api-types');

// create types dir if not exists
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

fs.copyFileSync(typeFile, path.join(typesDir, 'index.d.ts'));
