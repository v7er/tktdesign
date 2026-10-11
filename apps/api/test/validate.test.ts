import { describe, expect, it } from 'vitest';
import { parseInquiry, parseProject, isVnPhone } from '../src/validate';

describe('isVnPhone', () => {
	it('accepts common mobile formats', () => {
		expect(isVnPhone('0901234567')).toBe(true);
		expect(isVnPhone('0901 234 567')).toBe(true);
		expect(isVnPhone('+84 901234567')).toBe(true);
	});

	it('rejects short or landline-looking values', () => {
		expect(isVnPhone('123')).toBe(false);
		expect(isVnPhone('012345')).toBe(false);
	});
});

describe('parseProject', () => {
	it('requires a title', () => {
		const result = parseProject({ title: '' });
		expect(result.ok).toBe(false);
	});

	it('fills defaults for a valid house project', () => {
		const result = parseProject({
			title: 'Nhà phố 5x16 Gò Vấp',
			category: 'nha-pho'
		});
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.title).toBe('Nhà phố 5x16 Gò Vấp');
		expect(result.data.slug).toBe('nha-pho-5x16-go-vap');
		expect(result.data.status).toBe('draft');
		expect(result.data.featured).toBe(false);
	});
});

describe('parseInquiry', () => {
	it('requires name, phone and message', () => {
		expect(parseInquiry({ name: '', phone: '0901234567', message: 'xin tư vấn' }).ok).toBe(false);
		expect(parseInquiry({ name: 'An', phone: '123', message: 'xin tư vấn' }).ok).toBe(false);
		expect(parseInquiry({ name: 'An', phone: '0901234567', message: '' }).ok).toBe(false);
	});

	it('accepts a complete contact request', () => {
		const result = parseInquiry({
			name: 'Nguyễn An',
			phone: '0901234567',
			email: 'an@example.com',
			district: 'Gò Vấp',
			land_area_m2: 80,
			message: 'Cần thiết kế nhà phố 5x16, ở 3 thế hệ.'
		});
		expect(result.ok).toBe(true);
	});
});
