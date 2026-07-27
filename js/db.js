let db = null;
let dbReadyResolve;
const dbReady = new Promise((resolve) => { dbReadyResolve = resolve; });
const DB_STORAGE_KEY = "thedelight_sqlite_db";

async function initDB() {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/${file}`,
  });
  const saved = localStorage.getItem(DB_STORAGE_KEY);
  if (saved) {
    const binary = atob(saved);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    db = new SQL.Database(bytes);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL, table_no TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
      CREATE TABLE delivery_orders (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL, address TEXT NOT NULL, email TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
      CREATE TABLE feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, rating INTEGER NOT NULL, message TEXT, created_at TEXT DEFAULT (datetime('now')));
      CREATE TABLE menu_items (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL, name TEXT NOT NULL, price INTEGER NOT NULL);
    `);
    seedMenu();
    saveDB();
  }
  dbReadyResolve();
}

function seedMenu() {
  const veg = [["Veg","Paneer Butter Masala",220],["Veg","Dal Tadka",150],["Veg","Veg Biryani",190],["Veg","Malai Kofta",210],["Veg","Palak Paneer",200],["Veg","Jeera Rice",120]];
  const nonveg = [["Non-Veg","Chicken Tikka Masala",260],["Non-Veg","Mutton Rogan Josh",320],["Non-Veg","Chicken Biryani",240],["Non-Veg","Fish Curry",280],["Non-Veg","Butter Chicken",270],["Non-Veg","Egg Curry",160]];
  const stmt = db.prepare("INSERT INTO menu_items (category, name, price) VALUES (?, ?, ?)");
  [...veg, ...nonveg].forEach((row) => stmt.run(row));
  stmt.free();
}

function saveDB() {
  const data = db.export();
  let binary = "";
  data.forEach((b) => (binary += String.fromCharCode(b)));
  localStorage.setItem(DB_STORAGE_KEY, btoa(binary));
}

function runQuery(sql, params = []) { db.run(sql, params); saveDB(); }

function selectAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function downloadDB() {
  const data = db.export();
  const blob = new Blob([data], { type: "application/x-sqlite3" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "restaurant.db";
  a.click();
}

initDB();
