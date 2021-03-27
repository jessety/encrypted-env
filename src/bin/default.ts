#!/usr/bin/env node

import configFileEncryption from '../configFileEncryption';
import process from 'process';

const args = process.argv.slice(2);

const [encryptOrDecrypt, environment, overwriteString] = args;

if (encryptOrDecrypt !== 'encrypt' && encryptOrDecrypt !== 'decrypt') {
  console.error(`Please specify whether you would like to encrypt or decrypt.\ne.g. encrypted-env decrypt staging`);
  process.exit(1);
}

let overwriteExisting: boolean | undefined;

if (overwriteString !== 'false') {
  overwriteExisting = true;
}

if (encryptOrDecrypt === 'encrypt') {

  configFileEncryption.encrypt(environment, overwriteExisting).then(() => {

    // Great!

  }).catch((error: Error) => {

    console.error(error);
    process.exit(1);
  });

} else {

  configFileEncryption.decrypt(environment, overwriteExisting).then(() => {

    // Cool!

  }).catch((error: Error) => {

    console.error(error);
    process.exit(1);
  });

}
