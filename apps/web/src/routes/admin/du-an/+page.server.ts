import type { Project } from '#lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/admin/projects');
	if (!res.ok) return { projects: [] as Project[] };
	const data = (await res.json()) as { projects: Project[] };
	return { projects: data.projects ?? [] };
};
