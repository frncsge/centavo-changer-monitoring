CREATE TABLE admins (
	admin_id SERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	hashed_password TEXT NOT NULL,
	account_name VARCHAR(100)
);