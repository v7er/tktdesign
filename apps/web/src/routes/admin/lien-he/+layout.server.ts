import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { authed } = await parent();
	if (!authed) redirect(303, '/admin');
};
