import SimpleEncryption from '../../src/encryption/SimpleEncryption';

describe('SimpleEncryption', () => {

  test(`encrypts and decrypts basic strings`, async () => {

    const encryption = new SimpleEncryption('098f6bcd4621d373cade4e832627b4f6');

    const string = 'this is a test string';

    const encrypted = encryption.encrypt(string);
    const decrypted = encryption.decrypt(encrypted);

    expect(decrypted).toBe(string);
  });

  test(`encrypts and decrypts unicode strings`, async () => {

    const encryption = new SimpleEncryption('a1361cb85be840d6a2d762c68e4910e2');

    const string = '你好 ñ ø 🍔 🌮 🍜';

    const encrypted = encryption.encrypt(string);

    const decrypted = encryption.decrypt(encrypted);
    expect(decrypted).toBe(string);
  });

  test(`throws when attempting to encrypt with an invalid key`, async () => {
    expect.assertions(1);

    try {
      const encryption = new SimpleEncryption('abc123');
      encryption.encrypt('def456');
    } catch (error) {
      expect(error.code).toBe('KEY_INVALID');
    }
  });

  test(`throws when attempting to decrypt with an invalid key`, async () => {
    expect.assertions(1);

    try {
      const encryption = new SimpleEncryption('abc123');
      encryption.decrypt('abc123');
    } catch (error) {
      expect(error.code).toBe('KEY_INVALID');
    }
  });

  test(`throws when attempting to decrypt an invalid string`, async () => {
    expect.assertions(2);

    try {
      const encryption = new SimpleEncryption('a1361cb85be840d6a2d762c68e4910e2');
      encryption.decrypt('abc123');
    } catch (error) {
      expect(error.code).toBe('STRING_INVALID');
    }

    try {
      const encryption = new SimpleEncryption('a1361cb85be840d6a2d762c68e4910e2');
      encryption.decrypt(true as unknown as string);
    } catch (error) {
      expect(error.code).toBe('STRING_INVALID');
    }
  });
});
