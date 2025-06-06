--! create
INSERT INTO blood_requests(
    staff_id,
    blood_group,
    priority,
    title,
    max_people,
    start_time,
    end_time
    )
VALUES (
    :staff_id,
    :blood_group,
    :priority,
    :title,
    :max_people,
    :start_time,
    :end_time
)
RETURNING id;

--! count_appointment
SELECT COUNT(id) FROM appointments WHERE request_id = :request_id;

--! get_all
SELECT
    blood_group,
    priority,
    title,
    max_people,
    start_time,
    end_time
FROM blood_requests
WHERE now() < end_time AND is_active = true;

--! get_booked
SELECT
    blood_group,
    priority,
    title,
    max_people,
    start_time,
    end_time
FROM blood_requests
WHERE blood_requests.id IN (
    SELECT request_id
    FROM appointments
    WHERE member_id = :member_id
);

--! update (priority?, title?, max_people?)
UPDATE blood_requests
SET
    priority = COALESCE(:priority, priority),
    title = COALESCE(:title, title),
    max_people = COALESCE(:max_people, max_people)
WHERE id = :id;

--! delete
UPDATE blood_requests SET is_active = false WHERE id = :id;
