import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'keldorathal_secret_key_2026_super_secure_jwt_token'
);

const TOKEN_NAME = 'keldorathal_token';

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Sign JWT token
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  // In local network/LAN testing over HTTP (e.g. http://10.x.x.x:3000), 
  // setting secure: true causes mobile browsers (Chrome/Safari) to reject the cookie.
  // Allow secure only when explicitly enabled or on HTTPS production.
  const isSecure = process.env.COOKIE_SECURE === 'true';
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Remove auth cookie
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  const isSecure = process.env.COOKIE_SECURE === 'true';
  cookieStore.set(TOKEN_NAME, '', {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// Get current logged in user session
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}
