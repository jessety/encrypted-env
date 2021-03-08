import encryptedENV from 'encrypted-env';

const env = encryptedENV();

console.dir(env, { depth: 0 });
