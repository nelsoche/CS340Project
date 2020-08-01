module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Get the table of characters */
    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails FROM characters LEFT JOIN races ON characters.characterRace = races.raceID LEFT JOIN locations ON characters.characterOrigin = locations.locationID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    /* Get list of all possible races */
    function getRaces(res, mysql, context, complete){
        mysql.pool.query("SELECT raceID, raceName FROM races", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.races = results;
            complete();
        });
    }

    /* Get list of all possible locations of origin */
    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT locationID, locationName FROM locations", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    /* Get list of all media */
    function getMedia(res, mysql, context, complete){
        mysql.pool.query("SELECT mediaID, title AS mediaTitle FROM media", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.media = results;
            complete();
        });
    }

    /* Sorting. Get get characters sorted by specified criteria, A-Z, Z-A, Race, or Location of Origin */
    function getSortedCharacters(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails FROM characters LEFT JOIN races ON characters.characterRace = races.raceID LEFT JOIN locations ON characters.characterOrigin = locations.locationID";
        console.log(req.params);
        if(req.params.sortBy == "1"){
            query += " ORDER BY characters.characterName ASC";
        }else if(req.params.sortBy == "2"){
            query += " ORDER BY characters.characterName DESC";
        }else if(req.params.sortBy == "3"){
            query += " ORDER BY characterRace, characterName ASC";
        }else if(req.params.sortBy == "4"){
            query += " ORDER BY characterOrigin, characterName ASC";
        }
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    /* Filtering. Get all characters of a specific race */
    function getCharactersByRace(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails FROM characters LEFT JOIN races ON characters.characterRace = races.raceID LEFT JOIN locations ON characters.characterOrigin = locations.locationID WHERE characters.characterRace = ?";
        console.log(req.params);
        var inserts = [req.params.race];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }
    
    /* Filtering. Get all characters of a specific location of origin */
    function getCharactersByLocation(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails FROM characters LEFT JOIN races ON characters.characterRace = races.raceID LEFT JOIN locations ON characters.characterOrigin = locations.locationID WHERE characters.characterOrigin = ?";
        console.log(req.params);
        var inserts = [req.params.location];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    /* Filtering. Get all characters of a specific race */
    function getCharactersByMedia(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails FROM characters LEFT JOIN races ON characters.characterRace = races.raceID LEFT JOIN locations ON characters.characterOrigin = locations.locationID INNER JOIN character_media ON characters.characterID = character_media.characterID WHERE character_media.mediaID = ?";
        console.log(req.params);
        var inserts = [req.params.media];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    /* Get weapons used by all of the characters */
    function getCharWeapons(res, mysql, context, complete){
        mysql.pool.query("SELECT characters.characterID AS charID, weapons.weaponType FROM characters INNER JOIN character_weapons ON characters.characterID = character_weapons.characterID INNER JOIN weapons ON weapons.weaponID = character_weapons.weaponID ORDER BY charID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weaponsUsed = results;
            complete();
        });
    }

    /* Get media appearances for all of the characters */
    function getCharMedia(res, mysql, context, complete){
        mysql.pool.query("SELECT characters.characterID AS charID, media.title AS mediaTitle FROM characters INNER JOIN character_media ON characters.characterID = character_media.characterID INNER JOIN media ON media.mediaID = character_media.mediaID ORDER BY charID, mediaTitle", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.charMedia = results;
            complete();
        });
    }

    /*Display all characters*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Characters";
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, complete);
        getCharWeapons(res, mysql, context, complete);
        getCharMedia(res, mysql, context, complete);
        getRaces(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getMedia(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 6){
                res.render('characters', context);
            }
        }
    });

    /* Sort characters by criteria from dropdown selection */
    router.get('/sort/:sortBy', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Characters";
        var mysql = req.app.get('mysql');
        getSortedCharacters(req, res, mysql, context, complete);
        getRaces(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getMedia(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }
        }
    });

    /* Filter characters by race */
    router.get('/filter/race/:race', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Characters";
        var mysql = req.app.get('mysql');
        getCharactersByRace(req, res, mysql, context, complete);
        getRaces(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getMedia(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }
        }
    });

    /* Filter characters by location of origin */
    router.get('/filter/location/:location', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Characters";
        var mysql = req.app.get('mysql');
        getCharactersByLocation(req, res, mysql, context, complete);
        getRaces(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getMedia(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }
        }
    });

    /* Filter characters by media appearance */
    router.get('/filter/media/:media', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Characters";
        var mysql = req.app.get('mysql');
        getCharactersByMedia(req, res, mysql, context, complete);
        getRaces(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getMedia(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }
        }
    });

    /* Add a character to the database */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO characters (characterName, actorName1, actorName2, characterRace, characterOrigin) VALUES (?, ?, ?, ?, ?)";
        var race = req.body.raceSelect;
        if(race == "NULL"){
            race = null;
        }
        var location = req.body.locationSelect;
        if(location == "NULL"){
            location = null;
        }
        var inserts = [req.body.charName, req.body.actorName1, req.body.actorName2, race, location];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/characters');
            }
        });
    });

    /* Delete a character from the database */
    router.delete('/:characterID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM characters WHERE characterID = ?";
        var inserts = [req.params.characterID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end;
            }
        });
    });


    return router;
}();