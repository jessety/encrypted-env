# encrypted-env

[![ci](https://github.com/jessety/encrypted-env/workflows/ci/badge.svg)](https://github.com/jessety/encrypted-env/actions/workflows/ci.yml)

`encrypted-env` is designed to make encrypting and decrypting sensitive `.env` files a breeze. It's supports using different configuration files for different environments (e.g. `development`, `staging`, and `production`) with different encryption keys for each, and can detect which to load based on existing environmental variavbles.

## Installation

```bash
npm install encrypted-env
```

## Encrypting / Decrypting

This package provides two commands, `env-encrypt` and `env-decrypt`. To encrypt your `.env` file, run `npx env-encrypt`. If encrypting for the first time, the user will be prompted to enter in a 32-character key. The key is then stored for future encryption / decryption.

## Multiple Environments

Create a `.env-encrypted.config.json` configuration file in the root of your project that maps environment names to the filename of the configuration file to use.

```json
{
  "development": ".env.dev",
  "staging": ".env.staging",
  "production": ".env.prod"
}
```

Once defined, you can encrypt and decrypt configuration files for each environment by appending the environment name to the command:

```bash
npx env-encrypt staging
```

This may also be used in the `scripts` section of your `package.json` file:

```json
{
  "name": "project-name"
  "scripts": {
    "encrypt:staging": "env-encrypt staging",
    "decrypt:staging": "env-decrypt staging"
  }
}
```

## CI

To enable dynamic decryption in CI, set a secret in the repository and inject it into the process ENV for decryption.

For example, here's a GitHub Actions job that decrypts the env files for a project prior to running integration tests that require them:

```yaml
  integration-test:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: 14.x

      - name: Install dependencies
        run: npm install

      - name: Decrypt env
        run: npx env-decrypt
        env:
          ENV_KEY: ${{ secrets.ENV_KEY }}
          CI: true

      - name: Run integration tests
        run: npm run test:integration
```

## Loading configuration in runtime

To load environmental variables into your project:

```typescript
import loadENV from 'encrypted-env';

const env = loadENV();
```

If you have multiple environments defined, it will load the config file that corresponds to the environment set in the `NODE_ENV` or `ENVIRONMENT` variable.

For example, if the `NODE_ENV` process env is set to `development` and the `.env-encrypted.config.json` file looks like this:

```json
{
  "development": ".env.dev",
  "staging": ".env.staging",
  "production": ".env.prod"
}
```

Then it will attempt to parse and load `.env.dev`. If it cannot find `.env.dev`, it will fail with an error prompting the user to run `npx env-decrypt development`- which will attempt to create `.env.dev` from `.env.dev.encrypted`.

## Version Control

Make sure to add these lines to your `.gitignore` file:

```text
**/*.env
**/*.key
```

This way, only the encrypted `.env` files will be pushed to version control.

## License

MIT © Jesse Youngblood
