
DROP TABLE IF EXISTS scale;
DROP TABLE IF EXISTS note;


CREATE TABLE note (
  id INTEGER PRIMARY KEY,
  name VARCHAR(3) NOT NULL UNIQUE -- C, C#, D, ... B
);


CREATE TABLE scale (
  id VARCHAR(64) PRIMARY KEY,
  display_name VARCHAR(128) NOT NULL
);


INSERT INTO note (id, name) VALUES
  (0, 'C'),
  (1, 'C#'),
  (2, 'D'),
  (3, 'D#'),
  (4, 'E'),
  (5, 'F'),
  (6, 'F#'),
  (7, 'G'),
  (8, 'G#'),
  (9, 'A'),
  (10, 'A#'),
  (11, 'B');

-- Seed: Scales
INSERT INTO scale (id, display_name) VALUES
  ('major', 'Major (Ionian)'),
  ('natural_minor', 'Natural Minor (Aeolian)'),
  ('dorian', 'Dorian'),
  ('mixolydian', 'Mixolydian'),
  ('major_pentatonic', 'Major Pentatonic'),
  ('minor_pentatonic', 'Minor Pentatonic'),
  ('blues_minor', 'Blues (Minor)');
