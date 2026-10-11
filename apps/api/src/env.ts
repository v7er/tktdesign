export type Bindings = {
	DB: D1Database;
	MEDIA?: R2Bucket;
	ADMIN_SECRET_HASH: string;
};

export type AppEnv = { Bindings: Bindings };
