import { error } from '@sveltejs/kit';
import type { Project } from '#lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`/api/projects/${params.slug}`);
	if (res.status === 404) error(404, 'Không tìm thấy dự án.');
	if (!res.ok) error(500, 'Không tải được dự án.');
	const data = (await res.json()) as { project: Project };
	return { project: data.project };
};
