import { describe, expect, it } from 'vitest';
import { createSecretHash, verifySecret } from '../src/secret';

describe('admin secret hashing', () => {
	it('accepts the original secret and rejects a guess', async () => {
		const secret = 'k7m2-qp9x-test-secret-value';
		const stored = await createSecretHash(secret);

		expect(stored.startsWith('pbkdf2$')).toBe(true);
		expect(await verifySecret(secret, stored)).toBe(true);
		expect(await verifySecret('wrong-secret', stored)).toBe(false);
	});

	it('rejects malformed stored hashes without throwing', async () => {
		expect(await verifySecret('anything', 'not-a-hash')).toBe(false);
		expect(await verifySecret('anything', '')).toBe(false);
	});
});
