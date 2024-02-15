import fs from 'fs';
import path from 'path';

// {
//   development: '.config.dev.env',
//   staging: '.config.staging.env',
//   production: '.config.prod.env'
// };


const defaultConfigFileName = '.env-encrypted.config.json';

/**
 * Get a list of valid environments and their configuration file paths
 */
export function environmentToConfigMap(configFileName = defaultConfigFileName): {[key:string]: string} | undefined {

  const configPath = path.join(process.cwd(), configFileName);

  if (fs.existsSync(configPath) === false) {
    return;
  }

  try {

    const contents = fs.readFileSync(configPath).toString();

    const parsed = JSON.parse(contents) as {[key:string]: string};

    if (typeof parsed !== 'object' || parsed === null) {
      console.warn(`Config file ${configFileName} appears invalid: "${contents}"`);
      return;
    }

    return parsed;

  } catch (error) {

    console.warn(`Caught error reading config file ${configFileName}:`, error);
    return;
  }
}

export default function configForEnvironment(environment = 'default', configFileName = defaultConfigFileName): string {

  const configMap = environmentToConfigMap(configFileName);

  // If there's no config map, assume we just have a singular .env file
  if (configMap === undefined) {
    return '.env';
  }

  return configMap[environment];
}
