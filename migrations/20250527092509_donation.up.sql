CREATE TABLE IF NOT EXISTS blood_requests(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id uuid NOT NULL REFERENCES accounts(id),
    blood_group_id uuid NOT NULL REFERENCES blood_groups(id),
    title text NOT NULL,
    max_people int NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
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
    created_at timestamptz NOT NULL DEFAULT now()
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
    created_at timestamptz NOT NULL DEFAULT now()
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
    expired_time timestamptz NOT NULL
);
