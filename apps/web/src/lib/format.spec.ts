import { describe, expect, it } from 'vitest';
import { formatPlot } from './format';

describe('formatPlot', () => {
	it('renders Vietnamese townhouse plot size', () => {
		expect(formatPlot(5, 16)).toBe('5×16 m');
	});
});
