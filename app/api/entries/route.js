import Database from "better-sqlite3";
import { NextResponse } from "next/server";

const db = new Database("./sqlite.db");

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roaster TEXT NOT NULL,
    origin TEXT NOT NULL,
    aroma TEXT NOT NULL,
    taste TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date TEXT NOT NULL
  )
`);

export async function POST(request) {
  try {
    const { roaster, origin, aroma, taste, rating } = await request.json();
    const date = new Date().toISOString();

    const stmt = db.prepare(
      `INSERT INTO entries (roaster, origin, aroma, taste, rating, date)
       VALUES (?, ?, ?, ?, ?, ?)`
    );

    const result = stmt.run(roaster, origin, aroma, taste, rating, date);

    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stmt = db.prepare("SELECT * FROM entries ORDER BY date DESC");
    const entries = stmt.all();
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
