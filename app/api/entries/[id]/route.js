import Database from "better-sqlite3";
import { NextResponse } from "next/server";

const db = new Database("./sqlite.db");

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { roaster, origin, aroma, taste, rating } = await request.json();

    const stmt = db.prepare(`
      UPDATE entries
      SET roaster = ?, origin = ?, aroma = ?, taste = ?, rating = ?
      WHERE id = ?
    `);

    const result = stmt.run(roaster, origin, aroma, taste, rating, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const stmt = db.prepare("DELETE FROM entries WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Entry deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
