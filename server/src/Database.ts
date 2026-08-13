import BetterSqlite3, { type Database as Sqlite } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// An example of the singleton design pattern where the database is lazily
// initialized. A good place to think about eager versus lazy and performance
// in large applications.
export class DB {
  private static instance: Sqlite | null = null;
  private static readonly DB_PATH: string = 'app.db';
  private static readonly memo = new Map<string, string>();

  private constructor() {
    /* no op */
  }

  private static getDB(): Sqlite {
    if (!this.instance) {
      const existsAlready = fs.existsSync(DB.DB_PATH);
      const db = new BetterSqlite3(DB.DB_PATH);

      if (!existsAlready) {
        // Build a database with the commands in sql/schema.sql
        db.exec(slurp('schema'));
      }

      this.instance = db;
    }

    return this.instance;
  }

  public static runQuery(path: string, ...args: unknown[]): Record<string, unknown>[] {
    let query = DB.memo.get(path);
    if (!query) {
      query = slurp(path);
      DB.memo.set(path, query);
    }

    return DB.getDB().prepare(query).all(...args) as Record<string, unknown>[];
  }
}

function slurp(sqlFile: string): string {
  return fs.readFileSync(path.join('src', 'sql', `${sqlFile}.sql`), 'utf8');
}
