CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS blood_groups(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(4) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS roles(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id uuid NOT NULL REFERENCES roles(id),
    email varchar(128) UNIQUE NOT NULL,
    password varchar(72) NOT NULL,
    phone varchar(16) UNIQUE,
    name varchar(64),
    gender int,
    address text,
    birthday date,
    blood_group_id uuid REFERENCES blood_groups(id),
    is_active boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now()
);
