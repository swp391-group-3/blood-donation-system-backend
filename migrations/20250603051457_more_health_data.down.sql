ALTER TABLE healths
ADD height real NOT NULl;

ALTER TABLE healths
DROP COLUMN upper_blood_pressure,
DROP COLUMN lower_blood_pressure,
DROP COLUMN heart_pulse,
DROP COLUMN hemoglobin;
