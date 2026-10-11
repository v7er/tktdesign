import type { Project } from '#lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const category = url.searchParams.get('loai') ?? '';
	const qs = category ? `?category=${encodeURIComponent(category)}` : '';
	try {
		const res = await fetch(`/api/projects${qs}`);
		if (!res.ok) return { projects: [] as Project[], category };
		const data = (await res.json()) as { projects: Project[] };
		return { projects: data.projects ?? [], category };
	} catch {
		return { projects: [] as Project[], category };
	}
};
