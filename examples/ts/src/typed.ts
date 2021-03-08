import loadENV from 'encrypted-env';

const env = loadENV();

// Define interface for config data

interface ConfigData {
  port: number,
  db: {
    uri: string,
    name: string
  }
}

const config: Partial<ConfigData> = {};

// Parse ENV values into typed data

config.port = Number(env.PORT);

config.db = {
  uri: env.DB_URI,
  name: env.DB_NAME
};

export default config as ConfigData;
