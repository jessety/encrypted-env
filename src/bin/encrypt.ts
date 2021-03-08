#!/usr/bin/env node

import configFileEncryption from '../configFileEncryption';
import process from 'process';

const args = process.argv.slice(2);

const [environment, overwriteString] = args;

let overwriteExisting: boolean | undefined;

if (overwriteString !== 'false') {
  overwriteExisting = true;
}

configFileEncryption.encrypt(environment, overwriteExisting).then(() => {

  // Great!

}).catch((error: Error) => {

  console.error(error);
  process.exit(1);
});
