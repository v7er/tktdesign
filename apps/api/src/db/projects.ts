import { and, asc, eq, ne } from 'drizzle-orm';
import type { DB } from './client';
import { projectImages, projects } from './schema';

export async function uniqueSlug(db: DB, slug: string, exceptId?: string): Promise<string> {
	let candidate = slug;
	let n = 2;
	while (true) {
		const row = await db.query.projects.findFirst({
			where: exceptId
				? and(eq(projects.slug, candidate), ne(projects.id, exceptId))
				: eq(projects.slug, candidate),
			columns: { id: true }
		});
		if (!row) return candidate;
		candidate = `${slug}-${n++}`.slice(0, 80);
	}
}

export function imagesFor(db: DB, projectId: string) {
	return db.query.projectImages.findMany({
		where: eq(projectImages.projectId, projectId),
		orderBy: [asc(projectImages.sortOrder)]
	});
}
