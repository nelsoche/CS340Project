/* Data Definition Queries */


/* table creation */
CREATE TABLE `characters` (
    `characterID` INT NOT NULL AUTO_INCREMENT,
    `characterName` TEXT NOT NULL,
    `actorName1` TEXT,
    `actorName2` TEXT,
    `characterRace` INT NOT NULL,
    `characterOrigin` INT,
    `weaponDetails` VARCHAR,
    PRIMARY KEY (`characterID`)
    UNIQUE KEY (`characterID`)
) ENGINE=InnoDB;

CREATE TABLE `locations` (
    `locationID` INT NOT NULL AUTO_INCREMENT,
    `locationName` TEXT NOT NULL,
    PRIMARY KEY (`locationID`)
    UNIQUE KEY (`locationID`)
) ENGINE=InnoDB;

CREATE TABLE `races` (
    `raceID` INT NOT NULL AUTO_INCREMENT,
    `raceName` TEXT NOT NULL,
    PRIMARY KEY (`raceID`)
    UNIQUE KEY (`raceID`)
) ENGINE=InnoDB;

CREATE TABLE `weapons` (
    `weaponID` INT NOT NULL AUTO_INCREMENT,
    `weaponType` TEXT NOT NULL,
    PRIMARY KEY (`weaponID`)
    UNIQUE KEY (`weaponID`)
) ENGINE=InnoDB;

CREATE TABLE `media` (
    `mediaID` INT NOT NULL AUTO_INCREMENT,
    `mediaType` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `releaseDate` DATE NOT NULL,
    `synopsis` VARCHAR,
    PRIMARY KEY (`mediaID`)
    UNIQUE KEY (`mediaID`)
) ENGINE=InnoDB;


/* data insertion */
INSERT INTO characters (characterID, characterName, actorName1, actorName2, characterRace, characterOrigin, weaponDetails) VALUES (NULL, 'Bilbo Baggins', 'Ian Holm', 'Martin Freeman', 'Hobbit', 'Shire', 'Sting');
INSERT INTO characters (characterID, characterName, actorName1, actorName2, characterRace, characterOrigin, weaponDetails) VALUES (NULL, 'Frodo Baggins', 'Elijah Wood', 'N/A', 'Hobbit', 'Shire', 'Barrow-blades');

INSERT INTO locations (locationID, locationName) VALUES (NULL, 'Gondor');
INSERT INTO locations (locationID, locationName) VALUES (NULL, 'Mordor');

INSERT INTO races (raceID, raceName) VALUES (NULL, 'Dwarf');
INSERT INTO races (raceID, raceName) VALUES (NULL, 'Elf');

INSERT INTO weapons (weaponID, weaponType) VALUES (NULL, 'Black Arrow');
INSERT INTO weapons (weaponID, weaponType) VALUES (NULL, 'Staff');

INSERT INTO media (mediaID, mediaType, title, releaseDate, synopsis) VALUES (NULL, 'Book', 'The Fellowship of the Ring', '1954-07-29', 'First book of the Lord of the Rings series...');
INSERT INTO media (mediaID, mediaType, title, releaseDate, synopsis) VALUES (NULL, 'Book', 'The Two Towers', '2002-12-18', 'Second movie in the Lord of the Rings series...');
