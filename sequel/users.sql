USE `sequencer_db`;

INSERT INTO Users (title, sequence, tempo, beat_division, num_steps, theme, sound, key_note, num_voices, num_favorites, play_count, createdAt, updatedAt)
VALUES (
	"Song 2",
    "['C3', 'C4', 'C3', 'C4', 'G3', 'G4', 'G3', 'G4', 'F3', 'F4', 'F3', 'F4', 'G3', 'G4', 'G3', 'G4']",
    120,
    8,
    4,
    "Default",
    "Synth",
    "C",
    8,
    0,
    0,
    "2017-10-31",
    "2017-10-31"
);

INSERT INTO Riffs (title, sequence, tempo, beat_division, num_steps, theme, sound, key_note, num_voices, num_favorites, play_count, createdAt, updatedAt)
VALUES (
	"Hello World",
    "['E4', 'G4', 'B4', 'D5', 'B4', 'D5', 'F5', 'A5', 'A4', 'C5', 'E5', 'G5', 'B4', 'D5', 'F5', 'A5']",
    84,
    8,
    4,
    "Default",
    "Synth",
    "C",
    8,
    0,
    0,
    "2017-11-02",
    "2017-11-02"
);

INSERT INTO Riffs (title, sequence, tempo, beat_division, num_steps, theme, sound, key_note, num_voices, num_favorites, play_count, createdAt, updatedAt)
VALUES (
    "Let Me Go",
    "['D4', 'E4', ' ', 'D4', 'E4', ' ', 'D4', 'G4', ' ', 'F4', 'E4', 'D4', ' ', 'C4', 'D4', 'E4']",
    84,
    8,
    4,
    "Default",
    "Synth",
    "C",
    8,
    0,
    0,
    "2017-11-02",
    "2017-11-02"
);
