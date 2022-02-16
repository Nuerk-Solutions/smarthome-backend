import { createHash } from 'crypto';
import { compare, hash } from 'bcrypt';

/**
 * @description Encode a string into a sha256 hash
 *
 * @param {string} text that should be encoded
 * @returns {string} The encoded string
 */
export function encodeString(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

/**
 * @description Compare a password with a sha256 hash
 * @param password The password to compare
 * @param hash The hash to compare with
 * @returns {boolean} True if the password matches the hash
 */
export async function validateHash(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }
  return compare(password, hash);
}

/**
 * @description Generate a random string
 * @param password The password to hash
 * @returns {string} The hashed password
 */
export async function generateHash(password: string): Promise<string> {
  return hash(password, 10);
}
