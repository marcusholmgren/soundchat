const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const {
  getAllowlistedUser,
  listAllowlistedUsers,
  upsertAllowlistedUser,
  writeAuthAudit,
} = require('./db');

const app = express();
const port = Number(process.env.PORT || 3001);
const jwtSecret = process.env.APP_JWT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const adminApiKey = process.env.ADMIN_API_KEY;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
const oauthClient = new OAuth2Client(googleClientId);

if (!jwtSecret?.trim() || !googleClientId?.trim() || !adminApiKey?.trim()) {
  throw new Error(
    'Missing env vars. Set APP_JWT_SECRET, GOOGLE_CLIENT_ID, and ADMIN_API_KEY.',
  );
}

app.use(
  cors({
    origin: frontendOrigin,
  }),
);
app.use(express.json());

const allowedStatuses = new Set(['invited', 'active', 'revoked']);
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const auditAuth = ({ email, outcome, reason }) => {
  writeAuthAudit({ email, outcome, reason });
  console.info(
    JSON.stringify({
      event: 'auth_attempt',
      email: email || null,
      outcome,
      reason,
      timestamp: new Date().toISOString(),
    }),
  );
};

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length).trim();
};

const requireSession = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Missing session token.' });
  }

  try {
    req.session = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

const requireAdmin = (req, res, next) => {
  const apiKey = req.headers['x-admin-api-key'];
  if (!apiKey || apiKey !== adminApiKey) {
    return res.status(401).json({ error: 'Invalid admin API key.' });
  }

  return next();
};

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/google', authLimiter, async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ error: 'Missing Google idToken.' });
  }

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();

    if (!email || !payload?.email_verified) {
      auditAuth({
        email,
        outcome: 'denied',
        reason: 'google_email_not_verified',
      });
      return res.status(403).json({ error: 'Google email is not verified.' });
    }

    const allowlistedUser = getAllowlistedUser(email);
    if (!allowlistedUser || allowlistedUser.status === 'revoked') {
      auditAuth({
        email,
        outcome: 'denied',
        reason: 'not_allowlisted',
      });
      return res.status(403).json({ error: 'Access denied: not invited.' });
    }

    const activeUser =
      allowlistedUser.status === 'invited'
        ? upsertAllowlistedUser({
            email,
            status: 'active',
            invitedBy: allowlistedUser.invitedBy,
          })
        : allowlistedUser;

    const sessionToken = jwt.sign(
      {
        email,
        status: activeUser.status,
      },
      jwtSecret,
      { expiresIn: '12h' },
    );

    auditAuth({
      email,
      outcome: 'approved',
      reason: activeUser.status,
    });

    return res.json({
      token: sessionToken,
      user: {
        email: activeUser.email,
        status: activeUser.status,
      },
    });
  } catch (error) {
    auditAuth({
      email: null,
      outcome: 'denied',
      reason: 'invalid_google_token',
    });
    return res.status(401).json({ error: 'Invalid Google token.' });
  }
});

app.get('/api/me', sessionLimiter, requireSession, (req, res) => {
  const allowlistedUser = getAllowlistedUser(req.session.email);

  if (!allowlistedUser || allowlistedUser.status === 'revoked') {
    return res.status(403).json({ error: 'Access revoked.' });
  }

  return res.json({
    email: allowlistedUser.email,
    status: allowlistedUser.status,
  });
});

app.get('/api/admin/users', adminLimiter, requireAdmin, (_, res) => {
  res.json({ users: listAllowlistedUsers() });
});

app.post('/api/admin/users', adminLimiter, requireAdmin, (req, res) => {
  const { email, status = 'invited', invitedBy = 'admin' } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' });
  }
  if (!allowedStatuses.has(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const user = upsertAllowlistedUser({ email, status, invitedBy });
  console.info(
    JSON.stringify({
      event: 'allowlist_updated',
      email: user.email,
      status: user.status,
      invitedBy,
      timestamp: new Date().toISOString(),
    }),
  );

  return res.status(201).json({ user });
});

app.listen(port, () => {
  console.info(`Auth server listening on http://localhost:${port}`);
});
