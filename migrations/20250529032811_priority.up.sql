CREATE TABLE IF NOT EXISTS request_priorities(
    id serial PRIMARY KEY,
    name varchar(16) UNIQUE NOT NULL
);

INSERT INTO request_priorities(name) VALUES
    ('low'),
    ('medium'),
    ('high');

ALTER TABLE blood_requests
ADD priority_id int NOT NULL REFERENCES request_priorities(id);
