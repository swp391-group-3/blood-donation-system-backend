CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS bloods(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blood_components(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blood_storages(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(32) UNIQUE NOT NULL,
    blood_id uuid NOT NULL REFERENCES bloods(id),
    component_id uuid NOT NULL REFERENCES blood_components(id),
    amount int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role int NOT NULL,
    email varchar(128) UNIQUE NOT NULL,
    phone varchar(16) UNIQUE NOT NULL,
    name varchar(64) NOT NULL,
    gender int NOT NULL,
    address text NOT NULL,
    birthday date NOT NULL,
    blood_id uuid REFERENCES bloods(id),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blogs(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    content text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id uuid NOT NULL REFERENCES blogs(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    content text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_tags(
    blog_id uuid NOT NULL REFERENCES blogs(id),
    tag_id uuid NOT NULL REFERENCES tags(id),

    PRIMARY KEY (blog_id, tag_id)
);

CREATE TABLE IF NOT EXISTS health_statuses(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS health_histories(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    temperature real NOT NULL,
    weight real NOT NULL,
    status_id uuid NOT NULL REFERENCES health_statuses(id),
    note text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donation_appointments(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    time timestamp NOT NULL,
    status int NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donation_kinds(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS donation_histories(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES donation_appointments(id),
    kind_id uuid NOT NULL REFERENCES donation_kinds(id),
    amount int NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);
