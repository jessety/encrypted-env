import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';

/**
 * Determine the encryption key for a given environment type
 * Attempt to pull this from: the process env, then a local file, and if all else fails just prompt the user
 */
export async function get(environment: string): Promise<string> {

  // Check to see if the decryption key is in our process ENV, use that if possible. This is likely for CI.
  // Check for the presence of a .key file (if the dev has already decrypted once) and use it if so
  // Otherwise, this is the first time this user has encrypted / decrypted this environment.

  const envKey = envKeyForEnvironment(environment);

  if (process.env[envKey] !== undefined && keyAppearsValid(process.env[envKey])) {

    console.log(`Found decryption key for ${environment} config from process ENV`);

    if (keyAppearsValid(process.env[envKey])) {
      return process.env[envKey] as string;
    }

    console.log(`However, it does not appear to be valid. Ignoring.`);
  }

  // The environmental variable doesn't exist, check for a key file

  const keyFilePath = determineKeyFilePath(environment);

  if (fs.existsSync(keyFilePath) === true) {

    console.log(`Found decryption key for ${environment} config in "${keyFilePath}"`);
    const keyData = await fs.promises.readFile(keyFilePath);
    const keyFromFile = keyData.toString().trim();

    if (keyAppearsValid(keyFromFile)) {
      return keyFromFile;
    }

    console.log(`However, it does not appear to be valid. Ignoring.`);
  }

  // The key file doesn't exist. If we're inter

  // If we're running in CI, give up now
  if (process.env.CI === 'true') {
    throw new Error(`Could not locate decryption key for ${environment} config`);
  }

  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'key',
    message: `What is the key for the "${environment}" environment?`,
    validate: function(value: string) {

      if (keyAppearsValid(value)) {
        return true;
      }

      return 'Please enter a valid key';
    }
  }]) as {[key: string]: string};

  return answers['key'].trim();
}

/**
 * Serialize a key locally for a given environment
 * So the user won't have to ever manually enter it more than once
 */
export async function set(environment: string, key: string): Promise<void> {

  const keyFilePath = determineKeyFilePath(environment);

  // Ensure the key directory exists
  if (fs.existsSync(keyDirectory()) === false) {
    await fs.promises.mkdir(keyDirectory());
  }

  // Write the file
  await fs.promises.writeFile(keyFilePath, `${key}\n`);
}

/**
 * Where should the keys be stored
 */
function keyDirectory(): string {
  return path.join(process.cwd(), '.keys');
}

/**
 * Determine the key file path
 */
function determineKeyFilePath(environment: string): fs.PathLike {
  const keyFilename = `${environment}.key`;
  return path.join(keyDirectory(), keyFilename);
}

/**
 * Does this key seem valid? Keys must be at least 32 characters
 */
function keyAppearsValid(key: string | undefined): boolean {
  return (typeof key === 'string' && key.length >= 32);
}

/**
 * What env value should specify the key to decrypt this environment type?
 */
function envKeyForEnvironment(environment: string): string {

  if (environment === 'default') {
    return `ENV_KEY`;
  }

  return `ENV_KEY_${environment}`.toUpperCase();
}

export default { get, set };
