const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const DB_PATH =
  process.env.ALLOWLIST_DB_PATH ||
  path.join(__dirname, 'data', 'soundchat-allowlist.sqlite');

const DB_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS allowlist_users (
    email TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK(status IN ('invited', 'active', 'revoked')),
    invited_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS auth_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    outcome TEXT NOT NULL CHECK(outcome IN ('approved', 'denied')),
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const selectUserStmt = db.prepare(
  'SELECT email, status, invited_by AS invitedBy, created_at AS createdAt, updated_at AS updatedAt FROM allowlist_users WHERE email = ?',
);
const listUsersStmt = db.prepare(
  'SELECT email, status, invited_by AS invitedBy, created_at AS createdAt, updated_at AS updatedAt FROM allowlist_users ORDER BY email ASC',
);
const upsertUserStmt = db.prepare(`
  INSERT INTO allowlist_users(email, status, invited_by, updated_at)
  VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(email) DO UPDATE SET
    status=excluded.status,
    invited_by=excluded.invited_by,
    updated_at=CURRENT_TIMESTAMP
`);
const insertAuditStmt = db.prepare(
  'INSERT INTO auth_audit_log(email, outcome, reason) VALUES (?, ?, ?)',
);

const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  return email.trim().toLowerCase();
};

function getAllowlistedUser(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return undefined;
  }

  return selectUserStmt.get(normalizedEmail);
}

function listAllowlistedUsers() {
  return listUsersStmt.all();
}

function upsertAllowlistedUser({ email, status, invitedBy = null }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error('Valid email is required.');
  }
  upsertUserStmt.run(normalizedEmail, status, invitedBy);
  return getAllowlistedUser(normalizedEmail);
}

function writeAuthAudit({ email, outcome, reason }) {
  insertAuditStmt.run(email ? normalizeEmail(email) : null, outcome, reason);
}

module.exports = {
  getAllowlistedUser,
  listAllowlistedUsers,
  upsertAllowlistedUser,
  writeAuthAudit,
};
