import Database from "better-sqlite3";
import { NextResponse } from "next/server";

export async function GET() {
  const db = new Database("./sqlite.db");

  try {
    db.prepare("DELETE FROM entries").run();

    return NextResponse.json(
      {
        success: true,
        message: "Successfully cleared all entries from the database",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    db.close();
  }
}
