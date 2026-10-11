import { slugify } from './slug';

const CATEGORIES = new Set(['nha-pho', 'cai-tao', 'biet-thu']);
const STATUSES = new Set(['draft', 'published']);

export type ProjectInput = {
	title: string;
	slug: string;
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
	featured: boolean;
	status: 'draft' | 'published';
};

export type InquiryInput = {
	name: string;
	phone: string;
	email: string;
	district: string;
	land_area_m2: number | null;
	message: string;
};

type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string };

function asRecord(body: unknown): Record<string, unknown> | null {
	return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
}

function str(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

function num(value: unknown): number | null {
	if (value == null || value === '') return null;
	const n = typeof value === 'number' ? value : Number(value);
	return Number.isFinite(n) ? n : null;
}

export function isVnPhone(input: string): boolean {
	const d = input.replace(/[\s.-]/g, '');
	return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(d);
}

export function parseProject(body: unknown): ParseResult<ProjectInput> {
	const rec = asRecord(body);
	if (!rec) return { ok: false, error: 'Dữ liệu không hợp lệ.' };

	const title = str(rec.title);
	if (title.length < 3) return { ok: false, error: 'Tên dự án tối thiểu 3 ký tự.' };

	const category = str(rec.category) || 'nha-pho';
	if (!CATEGORIES.has(category)) return { ok: false, error: 'Loại dự án không hợp lệ.' };

	const status = (str(rec.status) || 'draft') as ProjectInput['status'];
	if (!STATUSES.has(status)) return { ok: false, error: 'Trạng thái không hợp lệ.' };

	const slug = slugify(str(rec.slug) || title);
	if (!slug) return { ok: false, error: 'Đường dẫn dự án không hợp lệ.' };

	return {
		ok: true,
		data: {
			title,
			slug,
			summary: str(rec.summary),
			description: str(rec.description),
			location: str(rec.location),
			year: num(rec.year),
			category,
			land_width_m: num(rec.land_width_m),
			land_depth_m: num(rec.land_depth_m),
			floor_area_m2: num(rec.floor_area_m2),
			floors: num(rec.floors),
			functions: str(rec.functions),
			featured: Boolean(rec.featured),
			status
		}
	};
}

export function parseInquiry(body: unknown): ParseResult<InquiryInput> {
	const rec = asRecord(body);
	if (!rec) return { ok: false, error: 'Dữ liệu không hợp lệ.' };

	const name = str(rec.name);
	const phone = str(rec.phone);
	const message = str(rec.message);
	if (!name) return { ok: false, error: 'Vui lòng nhập họ tên.' };
	if (!isVnPhone(phone)) return { ok: false, error: 'Số điện thoại không hợp lệ.' };
	if (message.length < 10) return { ok: false, error: 'Nội dung tối thiểu 10 ký tự.' };

	const email = str(rec.email);
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { ok: false, error: 'Email không hợp lệ.' };
	}

	return {
		ok: true,
		data: {
			name,
			phone,
			email,
			district: str(rec.district),
			land_area_m2: num(rec.land_area_m2),
			message
		}
	};
}
