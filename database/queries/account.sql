--! register
INSERT INTO accounts(email, password, role)
VALUES(
    :email,
    :password,
    :role
)
RETURNING id;
