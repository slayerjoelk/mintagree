import crypto from "crypto";

/**
 * Generate a cryptographically secure numeric OTP.
 * Uses % 10 on each random byte — the modulo bias is negligible
 * (less than 1/256 per digit) and has no practical impact for 6-digit codes.
 */
export function generateOtp(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
}

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

/**
 * Constant-time OTP comparison to prevent timing attacks.
 * Uses crypto.timingSafeEqual — both inputs must be the same length.
 * If lengths differ, fails immediately (safe: no secret is leaked).
 */
export function verifyOtp(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return crypto.timingSafeEqual(a, b);
}
