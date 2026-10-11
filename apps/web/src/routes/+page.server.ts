import type { Project } from '#lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/projects?featured=1');
		if (!res.ok) return { featured: [] as Project[] };
		const data = (await res.json()) as { projects: Project[] };
		return { featured: data.projects ?? [] };
	} catch {
		return { featured: [] as Project[] };
	}
};
