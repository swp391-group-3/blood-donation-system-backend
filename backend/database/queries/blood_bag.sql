--! get
SELECT id, donation_id, component, is_used, amount, expired_time
FROM blood_bags
WHERE id = :id;

--! get_all
SELECT id, donation_id, component, is_used, amount, expired_time
FROM blood_bags;

--! create
INSERT INTO blood_bags (
    donation_id,
    component,
    is_used,
    amount,
    expired_time
)
VALUES (
    :donation_id,
    :component,
    :is_used,
    :amount,
    :expired_time
)
RETURNING id;