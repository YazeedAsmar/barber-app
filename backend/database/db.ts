import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite Database
const dbPath = path.join(__dirname, "barbershop.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Setup DB Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nameAr TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    serviceId TEXT NOT NULL,
    clientName TEXT NOT NULL,
    clientPhone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS blocked_slots (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    time TEXT NOT NULL
  );
`);

// Seed default services if they don't exist
const insertService = db.prepare(`INSERT OR IGNORE INTO services (id, name, nameAr, duration, price) VALUES (@id, @name, @nameAr, @duration, @price)`);
const seedServices = db.transaction(() => {
  insertService.run({ id: "1", name: "Classic Haircut", nameAr: "قص شعر كلاسيكي", duration: 30, price: 25 });
  insertService.run({ id: "2", name: "Beard Trim", nameAr: "تشذيب اللحية", duration: 20, price: 15 });
  insertService.run({ id: "3", name: "Haircut & Beard", nameAr: "قص شعر ولحية", duration: 50, price: 35 });
  insertService.run({ id: "4", name: "Hot Towel Shave", nameAr: "حلاقة بالمنشفة الساخنة", duration: 30, price: 20 });
});
seedServices();

export default db;
