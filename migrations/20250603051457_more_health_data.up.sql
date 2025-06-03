ALTER TABLE healths
DROP height;

ALTER TABLE healths
ADD COLUMN upper_blood_pressure int NOT NULL,
ADD COLUMN lower_blood_pressure int NOT NULL,
ADD COLUMN heart_pulse int NOT NULL,
ADD COLUMN hemoglobin real NOT NULL;
