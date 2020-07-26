/* Data Definition Queries */
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `locations`;
DROP TABLE IF EXISTS `races`;
DROP TABLE IF EXISTS `weapons`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `characters`;
DROP TABLE IF EXISTS `character_weapons`;
DROP TABLE IF EXISTS `character_media`;
SET FOREIGN_KEY_CHECKS = 1;

/* table creation */

CREATE TABLE `locations` (
    `locationID` INT(11) NOT NULL AUTO_INCREMENT,
    `locationName` TEXT NOT NULL,
    PRIMARY KEY (`locationID`),
    UNIQUE KEY (`locationName`)
);

CREATE TABLE `races` (
    `raceID` INT(11) NOT NULL AUTO_INCREMENT,
    `raceName` TEXT NOT NULL,
    PRIMARY KEY (`raceID`),
    UNIQUE KEY (`raceName`)
);

CREATE TABLE `weapons` (
    `weaponID` INT(11) NOT NULL AUTO_INCREMENT,
    `weaponType` TEXT NOT NULL,
    PRIMARY KEY (`weaponID`),
    UNIQUE KEY (`weaponType`)
);

CREATE TABLE `media` (
    `mediaID` INT(11) NOT NULL AUTO_INCREMENT,
    `mediaType` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `releaseDate` DATE NOT NULL,
    `synopsis` VARCHAR(255),
    PRIMARY KEY (`mediaID`)
);

CREATE TABLE `characters` (
    `characterID` INT(11) NOT NULL AUTO_INCREMENT,
    `characterName` TEXT NOT NULL,
    `actorName1` TEXT,
    `actorName2` TEXT,
    `characterRace` INT(11) DEFAULT NULL,
    `characterOrigin` INT(11) DEFAULT NULL,
    `weaponDetails` VARCHAR(255),
    PRIMARY KEY (`characterID`),
    UNIQUE KEY (`characterName`),
    CONSTRAINT FOREIGN KEY (`characterRace`) REFERENCES `races` (`raceID`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT FOREIGN KEY (`characterOrigin`) REFERENCES `locations` (`locationID`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `character_weapons` (
    `characterID` INT(11) NOT NULL DEFAULT '0',
    `weaponID` INT(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (`characterID`, `weaponID`),
    CONSTRAINT FOREIGN KEY (`characterID`) REFERENCES `characters` (`characterID`) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (`weaponID`) REFERENCES `weapons` (`weaponID`)
);

CREATE TABLE `character_media` (
    `characterID` INT(11) NOT NULL DEFAULT '0',
    `mediaID` INT(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (`characterID`, `mediaID`),
    CONSTRAINT FOREIGN KEY (`characterID`) REFERENCES `characters` (`characterID`) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (`mediaID`) REFERENCES `media` (`mediaID`) ON DELETE CASCADE
);


/* sample data insertion */

INSERT INTO locations (locationName)
VALUES ('Gondor'), ('Mordor'), ('Shire'), ('Mirkwood');

INSERT INTO races (raceName)
VALUES ('Hobbit'), ('Dwarf'), ('Elf');

INSERT INTO weapons (weaponType)
VALUES ('Sword'), ('Dagger'), ('Bow and Arrow');

INSERT INTO media (mediaType, title, releaseDate, synopsis)
VALUES ('Book', 'The Fellowship of the Ring', '1954-07-29', 'First book of The Lord of the Rings series written by J.R.R. Tolkien...'),
       ('Movie', 'The Two Towers', '2002-12-18', 'Second movie in the Lord of the Rings series directed by Peter Jackson...'),
       ('Movie', 'The Hobbit: An Unexpected Journey', '2012-12-14', 'First movie in The Hobbit Series directed by Peter Jackson...');

INSERT INTO characters (characterName, actorName1, actorName2, characterRace, characterOrigin, weaponDetails)
VALUES ('Bilbo Baggins', 'Ian Holm', 'Martin Freeman', 1, 3, 'Sword name: Sting'),
       ('Frodo Baggins', 'Elijah Wood', NULL, 1, 3, 'Sword name: Sting, Dagger name: Barrow-blade'),
       ('Legolas Greenleaf', 'Orlando Bloom', NULL, 3, 4, NULL);
       
INSERT INTO character_weapons (characterID, weaponID) VALUES (1, 1), (2, 1), (2, 2), (3, 3);

INSERT INTO character_media (characterID, mediaID) VALUES (1, 1), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2);
