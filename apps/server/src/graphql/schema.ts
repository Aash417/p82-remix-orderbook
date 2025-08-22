import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This makes the path relative to the root of the monorepo.
const schemaPath = path.join(__dirname, './schema.graphql');

export const typeDefs = fs.readFileSync(schemaPath, {
   encoding: 'utf-8',
});
