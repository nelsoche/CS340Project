/* Data Manipulation Queries */

-- Query to display all of the characters and their information
SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails
FROM characters
INNER JOIN races ON characters.characterRace = races.raceID
INNER JOIN locations ON characters.characterOrigin = locations.locationID;

-- Query for getting weapon types for characters
SELECT characters.characterID, weapons.weaponType AS weaponName FROM characters
INNER JOIN character_weapons ON characters.characterID = character_weapons.characterID
INNER JOIN weapons ON weapons.weaponID = character_weapons.weaponID
ORDER BY characterID;

-- Query for getting media appearances for characters
SELECT characters.characterID, media.title AS mediaTitle FROM characters
INNER JOIN character_media ON characters.characterID = character_media.characterID
INNER JOIN media ON media.mediaID = character_media.mediaID
ORDER BY characterID;

-- Query for sorting the characters table alphabetically by first name, A-Z
SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails
FROM characters
INNER JOIN races ON characters.characterRace = races.raceID
INNER JOIN locations ON characters.characterOrigin = locations.locationID
ORDER BY characters.characterName ASC;

-- Query for sorting the characters table alphabetically by first name, Z-A
SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails
FROM characters
INNER JOIN races ON characters.characterRace = races.raceID
INNER JOIN locations ON characters.characterOrigin = locations.locationID
ORDER BY characters.characterName DESC;

-- Query for sorting the characters table by race
SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails
FROM characters
INNER JOIN races ON characters.characterRace = races.raceID
INNER JOIN locations ON characters.characterOrigin = locations.locationID
ORDER BY characterRace, characterName ASC;

-- Query for sorting the characters table by location of origin
SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails
FROM characters
INNER JOIN races ON characters.characterRace = races.raceID
INNER JOIN locations ON characters.characterOrigin = locations.locationID
ORDER BY characterOrigin, characterName ASC;

-- Query to get all race IDs and Names to populate the Races dropdown for filtering
SELECT raceID, raceName FROM races;

-- Query to get all location IDs and Names to populate the Locations dropdown for filtering
SELECT locationID, locationName FROM locations;

-- Query to get all media IDs and titles to populate the Media dropdown for filtering
SELECT mediaID, title FROM media;

-- Query to add a character to characters table
INSERT INTO characters (characterName, actorName1, actorName2, characterRace, characterOrigin, weaponDetails)
VALUES (:name_input, :actor_name1_input, :actor_name2_input, :raceID_from_dropdown_input, :locationID_from_dropdown_input, :weaponDetails_text_input);

-- Queries to delete a character
DELETE FROM characters WHERE characterID = :characterID_from_delete_button;

-- Query to get specific character's data to place in the Update Character form when user clicks 'Update'
SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails
FROM characters
INNER JOIN races ON characters.characterRace = races.raceID
INNER JOIN locations ON characters.characterOrigin = locations.locationID
AND characters.characterID = :characterID_from_update_form;

-- Query to get specific character's weapon types to place in the Update Character form when user clicks 'Update'
SELECT characters.characterID, weapons.weaponType AS weaponName FROM characters
INNER JOIN character_weapons ON characters.characterID = character_weapons.characterID
INNER JOIN weapons ON weapons.weaponID = character_weapons.weaponID
AND characters.characterID = :characterID_from_update_form;

-- Query to get specific character's weapon types to place in the Update Character form when user clicks 'Update'
SELECT characters.characterID, media.title AS mediaTitle FROM characters
INNER JOIN character_media ON characters.characterID = character_media.characterID
INNER JOIN media ON media.mediaID = character_media.mediaID
AND characters.characterID = :characterID_from_update_form;

-- Query to update a character's data based on submission of the Update Character form 
UPDATE characters SET characterName = :name_input, actorName1 = :actor_name1_input, actorName2 = :actor_name2_input, characterRace = :raceID_from_dropdown_input, characterOrigin = :locationID_from_dropdown_input, weaponDetails = :textbox_input 
WHERE characterID = :characterID_from_update_form;

-- Query to add a weapon type to a character (create an M:M relationship)
INSERT INTO character_weapons (characterID, weaponID)
VALUES (:characterID_from_update_form, :weaponID_from_dropdown_input);

-- Query to add a media appearance to a character (create an M:M relationship)
INSERT INTO character_media (characterID, mediaID)
VALUES (:characterID_from_update_form, :mediaID_from_dropdown_input);

-- Query to remove a weapon type from a character (remove an M:M relationship)
DELETE FROM character_weapons WHERE characterID = :characterID_from_update_form AND weaponID = :weaponID_from_remove_button;

-- Query to remove a media appearance from a character (remove an M:M relationship)
DELETE FROM character_media WHERE characterID = :characterID_from_update_form AND mediaID = :mediaID_from_remove_button;

-- Query to display locations table
SELECT locationName FROM locations ORDER BY locationName ASC;

-- Query to add a location
INSERT INTO locations (locationName) VALUES (:locationName_input);

-- Query to display races table
SELECT raceName FROM races ORDER BY raceName ASC;

-- Query to add a race
INSERT INTO races (raceName) VALUES (:raceName_input);

-- Query to display weapons table
SELECT weaponType FROM weapons ORDER BY weaponType ASC;

-- Query to add a weapon type
INSERT INTO weapons (weaponType) VALUES (:weaponType_input);

-- Query to display media table
SELECT mediaID, mediaType, title, releaseDate, synopsis FROM media;

-- Query to sort media table by title A-Z
SELECT mediaID, mediaType, title, releaseDate, synopsis FROM media ORDER BY title ASC;

-- Query to sort media table by title Z-A
SELECT mediaID, mediaType, title, releaseDate, synopsis FROM media ORDER BY title DESC;

-- Query to sort media table by media type
SELECT mediaID, mediaType, title, releaseDate, synopsis FROM media ORDER BY mediaType, releaseDate ASC;

-- Query to filter media table by media type
SELECT mediaID, mediaType, title, releaseDate, synopsis FROM media WHERE mediaType = :mediaType_from_dropdown_selection;

-- Query to add a piece of media
INSERT INTO media (mediaType, title, releaseDate, synopsis)
VALUES (:mediaType_from_dropdown_selection, :title_input, :date_input, :synopsis_input);

-- Query to delete a piece of media
DELETE FROM media WHERE mediaID = :mediaID_from_delete_button;

-- Query to populate update form when user clicks 'Update' for media entry
SELECT mediaID, mediaType, title, releaseDate, synopsis FROM media WHERE mediaID = :mediaID_from_update_form;

-- Query to update a media entry
UPDATE media SET mediaType = :mediaType_from_dropdown_selection, title = :title_input, releaseDate = :date_input, synopsis = :synopsis_input 
WHERE mediaID = :mediaID_from_update_form;
