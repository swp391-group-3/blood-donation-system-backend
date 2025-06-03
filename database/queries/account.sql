--! register
INSERT INTO accounts(email, password, role_id)
VALUES(
    $1,
    $2,
    (SELECT id FROM roles WHERE name = 'member')
)
RETURNING id;
