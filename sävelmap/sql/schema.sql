


DROP TABLE IF EXISTS scale_interval;
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

CREATE TABLE scale_interval (
  scale_id VARCHAR(64) NOT NULL,
  interval_id INTEGER NOT NULL,
  FOREIGN KEY (scale_id) REFERENCES scale(id),
  PRIMARY KEY (scale_id, interval_id)
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

-- Scale intervals (semitones from root)
INSERT INTO scale_interval (scale_id, interval_id) VALUES
  ('major', 0), ('major', 2), ('major', 4), ('major', 5), ('major', 7), ('major', 9), ('major', 11),
  ('natural_minor', 0), ('natural_minor', 2), ('natural_minor', 3), ('natural_minor', 5), ('natural_minor', 7), ('natural_minor', 8), ('natural_minor', 10),
  ('dorian', 0), ('dorian', 2), ('dorian', 3), ('dorian', 5), ('dorian', 7), ('dorian', 9), ('dorian', 10),
  ('mixolydian', 0), ('mixolydian', 2), ('mixolydian', 4), ('mixolydian', 5), ('mixolydian', 7), ('mixolydian', 9), ('mixolydian', 10),
  ('major_pentatonic', 0), ('major_pentatonic', 2), ('major_pentatonic', 4), ('major_pentatonic', 7), ('major_pentatonic', 9),
  ('minor_pentatonic', 0), ('minor_pentatonic', 3), ('minor_pentatonic', 5), ('minor_pentatonic', 7), ('minor_pentatonic', 10),
  ('blues_minor', 0), ('blues_minor', 3), ('blues_minor', 5), ('blues_minor', 6), ('blues_minor', 7), ('blues_minor', 10);
