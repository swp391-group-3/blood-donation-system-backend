ALTER TABLE appointments
ADD CONSTRAINT unique_appointment UNIQUE (request_id, member_id);
