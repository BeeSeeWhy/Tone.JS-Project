CREATE TABLE songs (
	id int NOT NULL PRIMARY KEY,
	songTitle text NOT NULL,
	artist text, 
	year int,
	notes varchar NOT NULL
);

INSERT INTO songs (id, songTitle, artist, year, notes) 
VALUES (1, 'Ode to Joy (Dubstep Remix)', 'Friedrich Schiller', 1785, 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4'),
(2, 'Made You Look', 'Megan Trainor', 2022,'F4 G4 F4 D4 C4 Bb3 Bb3 Bb3 D4 Eb4 D4 C4 Bb3 A3 D4 A3 Bb3 Bb3 Bb3 Bb3 A3 G3 G3 A3 Bb3 C4 Bb3 A3 Bb3 D5 C5 C5 Bb4');