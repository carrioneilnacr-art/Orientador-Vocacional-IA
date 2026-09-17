import { VERIFIED_64_OPTIONS } from './src/data/questionnaireData.js';
import fs from 'fs';

// Quick workaround since it's ts
const content = fs.readFileSync('./src/data/questionnaireData.ts', 'utf-8');
// Just run it with tsx or compile
