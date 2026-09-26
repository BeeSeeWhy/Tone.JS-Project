CREATE TABLE songs (
	id int NOT NULL PRIMARY KEY,
	songTitle text NOT NULL,
	artist text, 
	year int,
	notes varchar NOT NULL
);

INSERT INTO songs (id, songTitle, artist, year, notes)
VALUES (1, 'Ode to Joy (Dubstep Remix)', 'Friedrich Schiller', 1785, 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4'),
(2, 'Made You Look', 'Megan Trainor', 2022,'F3 G3 F3 D3 C3 Bb2 Bb2 Bb2 D3 Eb3 D3 C3 Bb2 A2 D3 A2 Bb2 Bb2 Bb2 Bb2 A2 G2 G2 A2 Bb2 C3 Bb2 A2 Bb2 D4 C4 C4 Bb3'),
(3, 'Flowers', 'Miley Cyrus', 2023, 'E5 E5 E5 D5 C5 E5 F5 D5 D5 D5 C5 A4 E5 E5 E5 E5 E5 C5 E5 F5 D5 D5 C5 E5 D5 C5 C5'),
(4, 'Blinding Lights', 'The Weeknd', 2019, 'F5 F5 D#5 F5 G5 C5 D#5 F5 F5 D#5 F5 G5 C5 D#5 A#5 G5');