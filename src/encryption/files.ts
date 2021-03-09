import SimpleEncryption from './SimpleEncryption';
import fs from 'fs';

const suffix = '.encrypted';

/**
 * Encrypt a file with a given key, and create a new file with an additional suffix
 */
export async function encrypt(decryptedFilePath: fs.PathLike, key: string): Promise<void> {

  // Ensure the file exists

  if (fs.existsSync(decryptedFilePath) === false) {
    throw new Error(`There is no file to encrypt at "${decryptedFilePath}"`);
  }

  // Read the file

  const unencryptedContents = await fs.promises.readFile(decryptedFilePath).catch(error => {
    throw error;
  });

  // Encrypt the file contents

  const encryption = new SimpleEncryption(key);

  const encryptedContents = encryption.encrypt(unencryptedContents.toString());

  // Write the encrypted file contents to a new file

  const encryptedFilePath = `${decryptedFilePath}${suffix}`;

  await fs.promises.writeFile(encryptedFilePath, `${encryptedContents}\n`).catch(error => {
    throw error;
  });
}

/**
 * Decrypt a file from a given path, creating an unencrypted version
 */
export async function decrypt(encryptedFilePath: fs.PathLike, key: string): Promise<void> {

  // Ensure the file exists

  if (fs.existsSync(encryptedFilePath) === false) {
    throw new Error(`There is no file to decrypt at "${encryptedFilePath}"`);
  }

  // Read the encrypted file

  const encryptedContents = await fs.promises.readFile(encryptedFilePath).catch(error => {
    throw error;
  });

  // Decrypt the file contents

  const encryption = new SimpleEncryption(key);

  const decryptedContents = encryption.decrypt(encryptedContents.toString().replace('\n', ''));

  // Write the decrypted file contents to a plaintext config

  const decryptedFilePath = String(encryptedFilePath).replace(suffix, '');

  await fs.promises.writeFile(decryptedFilePath, decryptedContents).catch(error => {
    throw error;
  });
}

export default { encrypt, decrypt, suffix };
