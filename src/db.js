import { createPool } from "mysql2/promise";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";

import {
  PORT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
} from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sslCAPath = path.join(__dirname, 'private', 'DigiCertGlobalRootCA.crt.pem');
const sslCA = fs.readFileSync(sslCAPath, 'utf8');
export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  ssl: {
    ca: sslCA,
  },
  timezone: 'America/Bogota',
});
