import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "coffee-beans.db"));

// Initialize the database with our table
db.exec(`
  CREATE TABLE IF NOT EXISTS bean_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date TEXT NOT NULL
  )
`);

export function getAllEntries() {
  return db.prepare("SELECT * FROM bean_entries ORDER BY date DESC").all();
}

export function addEntry(origin, rating) {
  const stmt = db.prepare(
    "INSERT INTO bean_entries (origin, rating, date) VALUES (?, ?, ?)"
  );
  return stmt.run(origin, rating, new Date().toISOString());
}

export function deleteEntry(id) {
  const stmt = db.prepare("DELETE FROM bean_entries WHERE id = ?");
  return stmt.run(id);
}
