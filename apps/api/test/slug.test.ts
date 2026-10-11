import { describe, expect, it } from 'vitest';
import { slugify } from '../src/slug';

describe('slugify', () => {
	it('folds Vietnamese townhouse titles into ascii slugs', () => {
		expect(slugify('Nhà phố 5x16 Gò Vấp')).toBe('nha-pho-5x16-go-vap');
	});

	it('collapses punctuation and trims edges', () => {
		expect(slugify('  Cải tạo — nhà phố Tân Bình!!! ')).toBe('cai-tao-nha-pho-tan-binh');
	});

	it('returns empty string for blank input', () => {
		expect(slugify('   ')).toBe('');
	});
});
