CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS blood_groups(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(4) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blood_components(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS roles(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role uuid REFERENCES roles(id),
    email varchar(128) UNIQUE NOT NULL,
    phone varchar(16) UNIQUE NOT NULL,
    name varchar(64) NOT NULL,
    gender int NOT NULL,
    address text NOT NULL,
    birthday date NOT NULL,
    blood_group_id uuid REFERENCES blood_groups(id),
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

CREATE TABLE IF NOT EXISTS health_histories(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    temperature real NOT NULL,
    weight real NOT NULL,
    is_good_health boolean NOT NULL,
    note text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donation_types(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS donation_statuses(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS donations(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    time timestamp NOT NULL,
    status_id uuid NOT NULL REFERENCES donation_statuses(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    type_id uuid NOT NULL REFERENCES donation_types(id),
    amount int,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pre_donation_questions(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    index int NOT NULL,
    content text NOT NULL
);

CREATE TABLE IF NOT EXISTS pre_donation_answer(
    question_id uuid NOT NULL REFERENCES pre_donation_questions(id),
    donation_id uuid NOT NULL REFERENCES donations(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    content text NOT NULl
);

CREATE TABLE IF NOT EXISTS blood_bags(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id uuid  NOT NULL REFERENCES donations(id),
    component_id uuid NOT NULL REFERENCES blood_components(id),
    is_used bool NOT NULL DEFAUlT false,
    amount int NOT NULL,
    expired_time timestamp NOT NULL
);
