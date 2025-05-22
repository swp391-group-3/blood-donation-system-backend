CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS bloods(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL,
    expired_time int NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role int NOT NULL,
    email varchar(128) UNIQUE NOT NULL,
    phone varchar(16) UNIQUE NOT NULL,
    gender int NOT NULL,
    address text NOT NULL,
    birthday date NOT NULL,
    blood_id uuid REFERENCES bloods(id),
    is_active boolean NOT NULL DEFAULT true,
    update_at timestamp NOT NULL DEFAULT now()
);
