import crypto from 'crypto';

interface EncryptionOptions {
  algorithm: string,
  ivLength: number,
  encoding: 'utf8' | 'ascii' | 'binary',
  output: crypto.BinaryToTextEncoding,
  delimiter: string
}

class EncryptionError extends Error {
  code?: 'KEY_INVALID' | 'STRING_INVALID'
  constructor(message: string, code: 'KEY_INVALID' | 'STRING_INVALID') {
    super(message);
    this.code = code;
  }
}

/**
 * Handle encrypting and decrypting strings
 */
export default class SimpleEncryption {

  public key: string
  private options: EncryptionOptions

  constructor(key: string, options: EncryptionOptions = {
    algorithm: 'aes-256-cbc',
    ivLength: 16,
    encoding: 'utf8',
    output: 'hex',
    delimiter: '-'
  }) {

    this.key = key;
    this.options = options;
  }

  /**
   * Encrypt a string
   * @param string
   */
  encrypt(string: string): string {

    const { key } = this;
    const { algorithm, ivLength, encoding, output, delimiter } = this.options;

    if (key.length !== 32) {
      throw new EncryptionError('Encryption key must be 32 characters long', 'KEY_INVALID');
    }

    const iv = crypto.randomBytes(ivLength);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    let encrypted = cipher.update(string, encoding, output);

    encrypted += cipher.final(output);

    const ivString = iv.toString(output);

    return `${ivString}${delimiter}${encrypted}`;
  }

  /**
   * Decrypt a string
   * @param string
   */
  decrypt(string: string): string {

    const { key } = this;
    const { algorithm, output, delimiter } = this.options;

    if (key.length !== 32) {
      throw new EncryptionError('Encryption key must be 32 characters long', 'KEY_INVALID');
    }

    if (typeof string !== 'string') {
      throw new EncryptionError('Encrypted string is not in the correct format.', 'STRING_INVALID');
    }

    const components = string.split(delimiter);

    if (components.length < 2) {
      throw new EncryptionError('Encrypted string appears invalid.', 'STRING_INVALID');
    }

    const iv = Buffer.from(components.shift() as string, output);

    const encrypted = Buffer.from(components.join(delimiter), output);

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    let decrypted = decipher.update(encrypted);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  // /**
  //  * Stretch a key
  //  * @param key
  //  */
  // stretch(string: string): string {
  //
  //   const { salt, iterations, outputLength, algorithm } = this.options;
  //
  //   return crypto.pbkdf2Sync(string, salt, iterations, outputLength, algorithm).toString('hex');
  // }
}
