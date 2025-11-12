import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('barista.db');
export async function init() {
  await db.execAsync(`
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'barista'
    );
    CREATE TABLE IF NOT EXISTS audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      location TEXT,
      auditor_id INTEGER,
      score REAL DEFAULT 0,
      notes TEXT,
      FOREIGN KEY(auditor_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS audit_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      audit_id INTEGER NOT NULL,
      section TEXT NOT NULL,
      item TEXT NOT NULL,
      value TEXT,
      score REAL,
      FOREIGN KEY(audit_id) REFERENCES audits(id)
    );
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      tags TEXT
    );
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      ratio TEXT,
      steps TEXT
    );
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      options TEXT,
      answer TEXT
    );
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT NOT NULL,
      score REAL DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      source TEXT,
      summary TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}
