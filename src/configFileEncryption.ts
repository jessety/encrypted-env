import fileEncryption from './encryption/files';
import configForEnvironment, { environmentToConfigMap } from './configForEnvironment';
import currentEnvironment from './currentEnvironment';
import keyForEnvironment from './keyForEnvironment';
import process from 'process';
import path from 'path';
import fs from 'fs';

/**
 * Decrypt a config file for an environment
 * @param environment - The config environment to encrypt
 * @param overwriteExisting - Whether to force overwrite an existing decrypted config data
 * @returns
 */
export async function decrypt(environment = 'default', overwriteExisting = false): Promise<void> {

  environment = environment ?? currentEnvironment();

  const environments = environmentToConfigMap() ?? {};

  if (environment !== 'default' && environments[environment] === undefined) {
    throw new Error(`"${environment}" is now an allowed environment type. Must be one of these: ${Object.keys(environments).join(', ')}`);
  }

  const decryptedFilename = configForEnvironment(environment);
  const encryptedFilename = `${decryptedFilename}${fileEncryption.suffix}`;
  const decryptedFilePath = path.join(process.cwd(), decryptedFilename);
  const encryptedFilePath = path.join(process.cwd(), encryptedFilename);

  // If the file exists and we aren't set to explicitly overwrite it, don't.
  if (fs.existsSync(decryptedFilePath) && overwriteExisting !== true) {
    return;
  }

  try {

    // Acquire the encryption key
    const key = await keyForEnvironment.get(environment);

    // Decrypt the file
    await fileEncryption.decrypt(encryptedFilePath, key);

    // If that was successful, permenantly save the key so this user won't have to enter it again
    await keyForEnvironment.set(environment, key);

    console.log(`Successfully decrypted "${encryptedFilename}" into "${decryptedFilename}"`);

  } catch (error: unknown) {

    console.error(error);
    throw error;
  }
}

/**
 * Encrypt a config file for an environment
 * @param environment - The config environment to encrypt
 * @param overwriteExisting - Whether to force overwrite an existing encrypted config data
 * @returns
 */
export async function encrypt(environment?: string, overwriteExisting = true): Promise<void> {

  environment = environment ?? currentEnvironment();

  const environments = environmentToConfigMap() ?? {};

  if (environment !== 'default' && environments[environment] === undefined) {
    throw new Error(`"${environment}" is now an allowed environment type. Must be one of these: ${Object.keys(environments).join(', ')}`);
  }

  const decryptedFilename = configForEnvironment(environment);
  const encryptedFilename = `${decryptedFilename}${fileEncryption.suffix}`;
  const decryptedFilePath = path.join(process.cwd(), decryptedFilename);
  const encryptedFilePath = path.join(process.cwd(), encryptedFilename);

  // If an encrypted version of this file exists and we aren't set to overwrite it, don't.
  if (fs.existsSync(encryptedFilePath) && overwriteExisting !== true) {
    console.warn(`An encrypted version of the config for the ${environment} environment already exists, not overwriting.`);
    return;
  }

  try {

    // Acquire the encryption key
    const key = await keyForEnvironment.get(environment);

    // Decrypt the file
    await fileEncryption.encrypt(decryptedFilePath, key);

    // Permenantly save the key so this user won't have to enter it again
    await keyForEnvironment.set(environment, key);

    console.log(`Successfully encrypted "${decryptedFilename}" into "${encryptedFilename}"`);

  } catch (error) {

    console.error(error);
    throw error;
  }
}

export default { encrypt, decrypt };
