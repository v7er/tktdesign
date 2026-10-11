import type { Project, ProjectImage } from './schema';

export function serializeProject(row: Project, images: ProjectImage[] = []) {
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		summary: row.summary,
		description: row.description.replaceAll('\\n', '\n'),
		location: row.location,
		year: row.year,
		category: row.category,
		land_width_m: row.landWidthM,
		land_depth_m: row.landDepthM,
		floor_area_m2: row.floorAreaM2,
		floors: row.floors,
		functions: row.functions.replaceAll('\\n', '\n'),
		cover_key: row.coverKey,
		cover_url: row.coverKey ? `/api/media/${row.coverKey}` : null,
		featured: Boolean(row.featured),
		status: row.status,
		sort_order: row.sortOrder,
		created_at: row.createdAt,
		updated_at: row.updatedAt,
		images: images.map((img) => ({
			id: img.id,
			r2_key: img.r2Key,
			url: `/api/media/${img.r2Key}`,
			alt: img.alt,
			sort_order: img.sortOrder
		}))
	};
}

export function serializeInquiry(row: {
	id: string;
	name: string;
	phone: string;
	email: string;
	district: string;
	landAreaM2: number | null;
	message: string;
	status: string;
	createdAt: number;
}) {
	return {
		id: row.id,
		name: row.name,
		phone: row.phone,
		email: row.email,
		district: row.district,
		land_area_m2: row.landAreaM2,
		message: row.message,
		status: row.status,
		created_at: row.createdAt
	};
}
