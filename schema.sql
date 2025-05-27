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

CREATE TABLE IF NOT EXISTS blogs(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    title text NOT NULL,
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

CREATE TABLE IF NOT EXISTS blood_requests(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id uuid NOT NULL REFERENCES accounts(id),
    blood_group_id uuid NOT NULL REFERENCES blood_groupd(id),
    title text NOT NULL,
    max_people int NOT NULL,
    start timestamp NOT NULL,
    end timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid NOT NULL REFERENCES blood_requests(id),
    member_id uuid NOT NULL REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS questions(
    id serial PRIMARY KEY,
    content text NOT NULL,
    is_active bool NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS answers(
    question_id int NOT NULL REFERENCES questions(id),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    content text NOT NULL
);

CREATE TABLE IF NOT EXISTS healths(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    temperature real NOT NULL,
    weight real NOT NULL,
    is_good_health bool NOT NULL,
    note text,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donation_types(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) NOT NULL
);

CREATE TABLE IF NOT EXISTS donations(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    type_id uuid NOT NULL REFERENCES donation_types(id),
    amount int NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blood_components(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(16) NOT NULL
);

CREATE TABLE IF NOT EXISTS blood_bags(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id uuid NOT NULL REFERENCES donations(id),
    component_id uuid NOT NULL REFERENCES blood_components(id),
    is_used bool NOT NULL DEFAULT false,
    amount int NOT NULL,
    expired_time timestamp NOT NULL,
);
