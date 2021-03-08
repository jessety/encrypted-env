import { load } from 'env-smart';
import configForEnvironment from '../configForEnvironment';
import currentEnvironment from '../currentEnvironment';
import path from 'path';
import fs from 'fs';

export default function(environment?: string, options?: {
  lowercase?: boolean;
  uppercase?: boolean;
  process?: boolean;
  directory?: string;
  replace?: boolean;
  defaultsFilename?: string;
}): {[key:string]: string} {

  // Discern what type of environment we're running in, e.g. staging, production, etc.
  const type = environment ?? currentEnvironment();

  // Determine the correct .env file to load for the environment we're running in
  // Could be set in env-environments.json, or ommitted if there's only one
  const envFilename = configForEnvironment(type);

  if (envFilename === undefined) {
    throw new Error(`Could not determine environmental variables to load for environment type: "${type}"`);
  }

  const directory = options?.directory ?? process.cwd();

  // Confirm the env file actually exists

  if (fs.existsSync(path.join(directory, envFilename)) === false) {
    throw new Error(`Environmental variables file missing. Please decrypt "${envFilename}" into "${directory}" to run in "${type}" mode.\ne.g. npx env-decrypt ${type}`);
  }

  const env = load({
    directory,
    envFilename,

    lowercase: options?.lowercase,
    uppercase: options?.uppercase,
    process: options?.uppercase,
    replace: options?.replace,
    envDefaultsFilename: options?.defaultsFilename
  });

  return env as {[key:string]: string};
}
