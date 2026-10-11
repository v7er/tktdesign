import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
	id: text('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	summary: text('summary').notNull().default(''),
	description: text('description').notNull().default(''),
	location: text('location').notNull().default(''),
	year: integer('year'),
	category: text('category').notNull().default('nha-pho'),
	landWidthM: real('land_width_m'),
	landDepthM: real('land_depth_m'),
	floorAreaM2: real('floor_area_m2'),
	floors: integer('floors'),
	functions: text('functions').notNull().default(''),
	coverKey: text('cover_key'),
	featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
	status: text('status').notNull().default('draft'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
});

export const projectImages = sqliteTable('project_images', {
	id: text('id').primaryKey(),
	projectId: text('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	r2Key: text('r2_key').notNull(),
	alt: text('alt').notNull().default(''),
	sortOrder: integer('sort_order').notNull().default(0)
});

export const inquiries = sqliteTable('inquiries', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	phone: text('phone').notNull(),
	email: text('email').notNull().default(''),
	district: text('district').notNull().default(''),
	landAreaM2: real('land_area_m2'),
	message: text('message').notNull(),
	status: text('status').notNull().default('new'),
	createdAt: integer('created_at').notNull()
});

export const loginAttempts = sqliteTable('login_attempts', {
	ip: text('ip').primaryKey(),
	failCount: integer('fail_count').notNull(),
	lockedUntil: integer('locked_until'),
	lastAttemptAt: integer('last_attempt_at').notNull()
});

export const sessions = sqliteTable('sessions', {
	tokenHash: text('token_hash').primaryKey(),
	expiresAt: integer('expires_at').notNull(),
	createdAt: integer('created_at').notNull()
});

export const projectsRelations = relations(projects, ({ many }) => ({
	images: many(projectImages)
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
	project: one(projects, {
		fields: [projectImages.projectId],
		references: [projects.id]
	})
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectImage = typeof projectImages.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
