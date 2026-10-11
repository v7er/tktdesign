export type ProjectImage = {
	id: string;
	r2_key: string;
	url: string;
	alt: string;
	sort_order: number;
};

export type Project = {
	id: string;
	slug: string;
	title: string;
	summary: string;
	description: string;
	location: string;
	year: number | null;
	category: string;
	land_width_m: number | null;
	land_depth_m: number | null;
	floor_area_m2: number | null;
	floors: number | null;
	functions: string;
	cover_key: string | null;
	cover_url: string | null;
	featured: boolean;
	status: 'draft' | 'published';
	sort_order: number;
	created_at: number;
	updated_at: number;
	images: ProjectImage[];
};

export type Inquiry = {
	id: string;
	name: string;
	phone: string;
	email: string;
	district: string;
	land_area_m2: number | null;
	message: string;
	status: 'new' | 'read' | 'archived';
	created_at: number;
};
