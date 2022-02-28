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
 * @param data The data to compare
 * @param hash The hash to compare with
 * @returns {boolean} True if the password matches the hash
 */
export async function validateHash(data: string, hash: string): Promise<boolean> {
  if (!data || !hash) {
    return Promise.resolve(false);
  }
  console.log(await generateHash(data));
  return await compare(data, hash);
}

/**
 * @description Generate a random string
 * @param data The password to hash
 * @returns {string} The hashed password
 */
export async function generateHash(data: string): Promise<string> {
  return hash(data, 10);
}
