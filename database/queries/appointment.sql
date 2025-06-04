--! create
INSERT INTO appointments(request_id, member_id)
VALUES (:request_id, :member_id)
RETURNING id;
