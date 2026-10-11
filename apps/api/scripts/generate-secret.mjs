import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITERATIONS = 100_000;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function b64(bytes) {
	return Buffer.from(bytes).toString('base64');
}

function randomSecret() {
	const bytes = crypto.getRandomValues(new Uint8Array(24));
	const raw = Buffer.from(bytes).toString('base64url');
	return raw.match(/.{1,5}/g).join('-');
}

const secret = randomSecret();
const salt = crypto.getRandomValues(new Uint8Array(16));
const keyMaterial = await crypto.subtle.importKey(
	'raw',
	new TextEncoder().encode(secret),
	'PBKDF2',
	false,
	['deriveBits']
);
const bits = await crypto.subtle.deriveBits(
	{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
	keyMaterial,
	256
);
const stored = `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;

const devVars = `ADMIN_SECRET=${secret}\nADMIN_SECRET_HASH=${stored}\n`;
writeFileSync(resolve(root, '.dev.vars'), devVars);
writeFileSync(resolve(root, '../../.env'), `ADMIN_SECRET=${secret}\n`);

console.log('Đã ghi hash vào apps/api/.dev.vars');
console.log('Mật khẩu quản trị (giữ kín, không commit):');
console.log(secret);
