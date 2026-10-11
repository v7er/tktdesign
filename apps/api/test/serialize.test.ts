import { describe, expect, it } from 'vitest';
import { serializeProject } from '../src/db/serialize';

describe('serializeProject', () => {
	it('maps drizzle project rows to the public API shape', () => {
		const json = serializeProject(
			{
				id: 'p-govap',
				slug: 'nha-pho-5x16-go-vap',
				title: 'Nhà phố 5×16 Gò Vấp',
				summary: 'Tóm tắt',
				description: 'Dòng 1\\nDòng 2',
				location: 'Gò Vấp',
				year: 2024,
				category: 'nha-pho',
				landWidthM: 5,
				landDepthM: 16,
				floorAreaM2: 268,
				floors: 4,
				functions: 'Tầng 1: để xe.\\nTầng 2: ngủ.',
				coverKey: 'projects/p-govap/cover.jpg',
				featured: true,
				status: 'published',
				sortOrder: 1,
				createdAt: 1,
				updatedAt: 2
			},
			[
				{
					id: 'img-1',
					projectId: 'p-govap',
					r2Key: 'projects/p-govap/a.jpg',
					alt: 'mặt tiền',
					sortOrder: 0
				}
			]
		);

		expect(json.cover_url).toBe('/api/media/projects/p-govap/cover.jpg');
		expect(json.land_width_m).toBe(5);
		expect(json.featured).toBe(true);
		expect(json.description).toBe('Dòng 1\nDòng 2');
		expect(json.images[0]).toEqual({
			id: 'img-1',
			r2_key: 'projects/p-govap/a.jpg',
			url: '/api/media/projects/p-govap/a.jpg',
			alt: 'mặt tiền',
			sort_order: 0
		});
	});
});
