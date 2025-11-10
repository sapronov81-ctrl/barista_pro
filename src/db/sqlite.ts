import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite/next';

const db = SQLite.openDatabase('barista.db');
export { db };

export type DB = SQLite.SQLiteDatabase | null;
let _db: SQLite.SQLiteDatabase | null = null;

export function db(): DB {
  if (Platform.OS === 'web') return null;
  if (!_db) {
    _db = SQLite.openDatabaseSync('barista_pro.db');
    _db.execSync?.(`
      PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS cafes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
      CREATE TABLE IF NOT EXISTS audits (id INTEGER PRIMARY KEY AUTOINCREMENT, cafe TEXT, date TEXT,
        espresso_grind TEXT, espresso_time TEXT, espresso_yield TEXT, espresso_comment TEXT,
        drinks_json TEXT, standards_json TEXT, cleanliness_json TEXT, expiry_json TEXT, created_at TEXT);
      CREATE TABLE IF NOT EXISTS audit_drinks (id INTEGER PRIMARY KEY AUTOINCREMENT, audit_id INTEGER, name TEXT, volume TEXT, checks_json TEXT, foam_mm TEXT, comment TEXT, photo_uri TEXT);
      CREATE TABLE IF NOT EXISTS audit_checks (id INTEGER PRIMARY KEY AUTOINCREMENT, audit_id INTEGER, section TEXT, checks_json TEXT);
      CREATE TABLE IF NOT EXISTS attestations (id INTEGER PRIMARY KEY AUTOINCREMENT, cafe TEXT, date TEXT, fio TEXT,
        prep_json TEXT, target_seconds INTEGER, practice_json TEXT, practice_time_seconds INTEGER, theory_json TEXT,
        scores_json TEXT, category TEXT, created_at TEXT);
      CREATE TABLE IF NOT EXISTS attestation_drinks (id INTEGER PRIMARY KEY AUTOINCREMENT, attestation_id INTEGER, name TEXT, volume TEXT, checks_json TEXT, foam_mm TEXT, comment TEXT, photo_uri TEXT);
      CREATE TABLE IF NOT EXISTS equipment (id INTEGER PRIMARY KEY AUTOINCREMENT, cafe TEXT, name TEXT, serial TEXT, state TEXT, last_service TEXT, notes TEXT);
      CREATE TABLE IF NOT EXISTS equipment_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, equipment_id INTEGER, type TEXT, date TEXT, cost REAL, note TEXT);
      CREATE TABLE IF NOT EXISTS materials (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT, url TEXT, tags TEXT, note TEXT);
      CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, ingredients_json TEXT, steps_md TEXT, photo_uri TEXT);
      CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK (id=1), locale TEXT, pass_threshold INTEGER DEFAULT 85);
      CREATE TABLE IF NOT EXISTS trends_cache (id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT, item_json TEXT, created_at TEXT);
      CREATE TABLE IF NOT EXISTS updates_log (id INTEGER PRIMARY KEY AUTOINCREMENT, version TEXT, date TEXT, note TEXT, active INTEGER DEFAULT 0);
    `);
    // Ensure settings row exists
    _db.runSync?.("INSERT OR IGNORE INTO settings(id, locale, pass_threshold) VALUES (1,'ru',85)");
    // Add new JSON columns if missing (best-effort)
    try{ _db.execSync?.("ALTER TABLE settings ADD COLUMN theory_config_json TEXT"); }catch{}
    try{ _db.execSync?.("ALTER TABLE settings ADD COLUMN checklist_config_json TEXT"); }catch{}
  }
  return _db;
}
