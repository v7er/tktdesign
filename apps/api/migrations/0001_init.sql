CREATE TABLE projects (
	id TEXT PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	summary TEXT NOT NULL DEFAULT '',
	description TEXT NOT NULL DEFAULT '',
	location TEXT NOT NULL DEFAULT '',
	year INTEGER,
	category TEXT NOT NULL DEFAULT 'nha-pho',
	land_width_m REAL,
	land_depth_m REAL,
	floor_area_m2 REAL,
	floors INTEGER,
	functions TEXT NOT NULL DEFAULT '',
	cover_key TEXT,
	featured INTEGER NOT NULL DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'draft',
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);

CREATE INDEX idx_projects_public ON projects (status, featured, sort_order, year);

CREATE TABLE project_images (
	id TEXT PRIMARY KEY,
	project_id TEXT NOT NULL,
	r2_key TEXT NOT NULL,
	alt TEXT NOT NULL DEFAULT '',
	sort_order INTEGER NOT NULL DEFAULT 0,
	FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_project_images_project ON project_images (project_id, sort_order);

CREATE TABLE inquiries (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT NOT NULL DEFAULT '',
	district TEXT NOT NULL DEFAULT '',
	land_area_m2 REAL,
	message TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'new',
	created_at INTEGER NOT NULL
);

CREATE INDEX idx_inquiries_inbox ON inquiries (status, created_at);

CREATE TABLE login_attempts (
	ip TEXT PRIMARY KEY,
	fail_count INTEGER NOT NULL,
	locked_until INTEGER,
	last_attempt_at INTEGER NOT NULL
);

CREATE TABLE sessions (
	token_hash TEXT PRIMARY KEY,
	expires_at INTEGER NOT NULL,
	created_at INTEGER NOT NULL
);
