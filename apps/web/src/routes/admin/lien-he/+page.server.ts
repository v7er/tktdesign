import type { Inquiry } from '#lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/admin/inquiries');
	if (!res.ok) return { inquiries: [] as Inquiry[] };
	const data = (await res.json()) as { inquiries: Inquiry[] };
	return { inquiries: data.inquiries ?? [] };
};
