USE `sequencer_db`;

INSERT INTO Riffs (title, sequence, tempo, beat_division, num_steps, theme, sound, key_note, num_voices, num_favorites, play_count, createdAt, updatedAt)
VALUES (
	"Song 2",
    "['C3', 'C3', 'C3', 'C3']",
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
    "['C3', 'C3', 'C3', 'C3', ' ', ' ', 'E4']",
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
