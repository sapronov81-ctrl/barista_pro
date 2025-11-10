import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let _db: SQLite.SQLiteDatabase | null = null;

/**
 * Возвращает экземпляр базы данных SQLite (singleton)
 */
export function getDB(): SQLite.SQLiteDatabase | null {
  if (Platform.OS === 'web') return null;

  if (!_db) {
    _db = SQLite.openDatabaseSync('barista_pro.db');
  }

  return _db;
}
