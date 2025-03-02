import Database from "better-sqlite3";
import { NextResponse } from "next/server";

export async function GET() {
  const db = new Database("./sqlite.db");

  const dummyData = [
    {
      roaster: "Heart Coffee Roasters",
      origin: "Ethiopia Yirgacheffe",
      aroma: "Floral and citrus notes with hints of jasmine and bergamot",
      taste:
        "Bright acidity with notes of lemon, black tea, and honey. Clean finish.",
      rating: 5,
      date: new Date("2024-03-15").toISOString(),
    },
    {
      roaster: "Stumptown Coffee",
      origin: "Guatemala Antigua",
      aroma: "Rich chocolate and roasted nuts with subtle caramel",
      taste:
        "Medium body with chocolate and almond notes. Slight caramel sweetness.",
      rating: 4,
      date: new Date("2024-03-14").toISOString(),
    },
    {
      roaster: "Blue Bottle Coffee",
      origin: "Kenya Nyeri",
      aroma: "Bright and fruity with blackberry notes",
      taste: "Complex with blackberry, currant, and a wine-like acidity",
      rating: 1,
      date: new Date("2024-03-13").toISOString(),
    },
    {
      roaster: "Counter Culture Coffee",
      origin: "Colombia Narino",
      aroma: "Sweet caramel and vanilla with mild citrus",
      taste: "Balanced with orange, caramel, and milk chocolate notes",
      rating: 4,
      date: new Date("2024-03-12").toISOString(),
    },
    {
      roaster: "Intelligentsia Coffee",
      origin: "Costa Rica Tarrazu",
      aroma: "Brown sugar and apple with hints of cinnamon",
      taste: "Sweet and clean with apple, brown sugar, and subtle spice notes",
      rating: 3,
      date: new Date("2024-03-11").toISOString(),
    },
    {
      roaster: "Verve Coffee Roasters",
      origin: "Panama Gesha",
      aroma: "Intensely floral with jasmine and orange blossom",
      taste: "Delicate with floral notes, mandarin orange, and honey",
      rating: 5,
      date: new Date("2024-03-10").toISOString(),
    },
    {
      roaster: "Onyx Coffee Lab",
      origin: "Rwanda Gitesi",
      aroma: "Sweet and complex with stone fruit notes",
      taste: "Peach, apricot, and brown sugar with a creamy body",
      rating: 2,
      date: new Date("2024-03-09").toISOString(),
    },
    {
      roaster: "George Howell Coffee",
      origin: "Brazil Fazenda Alta Vista",
      aroma: "Nutty and sweet with milk chocolate notes",
      taste: "Smooth with hazelnut, milk chocolate, and subtle caramel",
      rating: 1,
      date: new Date("2024-03-08").toISOString(),
    },
    {
      roaster: "Ritual Coffee Roasters",
      origin: "Honduras Santa Barbara",
      aroma: "Sweet and balanced with toffee notes",
      taste: "Toffee, red apple, and mild citrus with a clean finish",
      rating: 4,
      date: new Date("2024-03-07").toISOString(),
    },
    {
      roaster: "Coava Coffee",
      origin: "Sumatra Andung Sari",
      aroma: "Earthy and complex with dark chocolate notes",
      taste: "Full-bodied with dark chocolate, cedar, and subtle spice",
      rating: 4,
      date: new Date("2024-03-06").toISOString(),
    },
  ];

  try {
    const stmt = db.prepare(`
      INSERT INTO entries (roaster, origin, aroma, taste, rating, date)
      VALUES (@roaster, @origin, @aroma, @taste, @rating, @date)
    `);

    const insertMany = db.transaction((entries) => {
      for (const entry of entries) {
        stmt.run(entry);
      }
    });

    insertMany(dummyData);

    return NextResponse.json(
      { message: "Seed data inserted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
