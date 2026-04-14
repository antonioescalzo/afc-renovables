import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./prisma/solar-panel.db");

// Simple insert for testing
db.serialize(() => {
  db.run("SELECT 1");
});

db.close();
console.log("✅ Database connected!");
