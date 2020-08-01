module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Get the table of characters */
    function getCharacter(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID, characterName, actorName1, actorName2, races.raceName AS characterRace, locations.locationName AS characterOrigin, weaponDetails FROM characters LEFT JOIN races ON characters.characterRace = races.raceID LEFT JOIN locations ON characters.characterOrigin = locations.locationID WHERE characters.characterID = ?";
        console.log(req.body);
        var inserts = [req.params.characterID];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results;
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

    /* Get weapons used by the character */
    function getCharWeapons(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID AS charID, weapons.weaponType AS weaponName, weapons.weaponID FROM characters INNER JOIN character_weapons ON characters.characterID = character_weapons.characterID INNER JOIN weapons ON weapons.weaponID = character_weapons.weaponID AND characters.characterID = ?";
        var inserts = [req.params.characterID];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.weaponsUsed = results;
            complete();
        });
    }

    /* Get media appearances for the character */
    function getCharMedia(req, res, mysql, context, complete){
        var query = "SELECT characters.characterID AS charID, media.title AS mediaTitle, media.mediaID FROM characters INNER JOIN character_media ON characters.characterID = character_media.characterID INNER JOIN media ON media.mediaID = character_media.mediaID AND characters.characterID = ?";
        var inserts = [req.params.characterID];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.charMedia = results;
            complete();
        });
    }

    /* Get weapons not used by the character */
    function getAvailableWeapons(req, res, mysql, context, complete){
        var query = "SELECT weapons.weaponID, weaponType FROM weapons INNER JOIN character_weapons ON weapons.weaponID = character_weapons.weaponID AND weaponType NOT IN (SELECT weaponType FROM weapons INNER JOIN character_weapons ON weapons.weaponID = character_weapons.weaponID WHERE character_weapons.characterID = ?) GROUP BY weaponType;";
        var inserts = [req.params.characterID];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.unusedWeapons = results;
            complete();
        });
    }

    /* Get media appearances not assigned to the character */
    function getAvailableMedia(req, res, mysql, context, complete){
        var query = "SELECT media.mediaID, title AS mediaTitle FROM media INNER JOIN character_media ON media.mediaID = character_media.mediaID AND title NOT IN (SELECT title FROM media INNER JOIN character_media ON media.mediaID = character_media.mediaID WHERE character_media.characterID = ?) GROUP BY title;";
        var inserts = [req.params.characterID];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.unusedMedia = results;
            complete();
        });
    }

    /* Display current character data */
    
    router.get('/:characterID', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Update Character";
        var mysql = req.app.get('mysql');
        getCharacter(req, res, mysql, context, complete);
        getCharWeapons(req, res, mysql, context, complete);
        getCharMedia(req, res, mysql, context, complete);
        getRaces(res, mysql, context, complete);
        getLocations(res, mysql, context, complete);
        getAvailableWeapons(req, res, mysql, context, complete);
        getAvailableMedia(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 7){
                console.log(context);
                res.render('char_update', context);
            }
        }
    });

    /* Submit updates to the character */

    router.post('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE characters SET characterName = ?, actorName1 = ?, actorName2 = ?, characterRace = ?, characterOrigin = ?, weaponDetails = ? WHERE characterID = ?";
        var race = req.body.charRace;
        if(race == "NULL"){
            race = null;
        }
        var location = req.body.charOrigin;
        if(location == "NULL"){
            location = null;
        }
        var inserts = [req.body.characterName, req.body.actorName1, req.body.actorName2, race, location, req.body.weaponInfo, req.body.charID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
        res.redirect('/char_update/' + req.body.charID);
    });

    /* Delete a weapon assigned to the character */

    router.delete('/character/:characterID/weapon/:weaponID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM character_weapons WHERE characterID = ? AND weaponID = ?";
        var inserts = [req.params.characterID, req.params.weaponID];
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

    /* Delete a media appearance assigned to the character */

    router.delete('/character/:characterID/media/:mediaID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM character_media WHERE characterID = ? AND mediaID = ?";
        var inserts = [req.params.characterID, req.params.mediaID];
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

    /* Assign a new weapon to the character */

    router.post('/add_weapons', function(req, res){
        var mysql = req.app.get('mysql');
        var weapons = req.body.addWeapon;
        var character = req.body.charID;
        for (let weapon of weapons){
            console.log("Processing weapon id " + weapon);
            var sql = "INSERT INTO character_weapons (characterID, weaponID) VALUES (?, ?)";
            var inserts = [character, weapon];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    console.log(error);
                }
            });
        }
        res.redirect('/char_update/' + character);
    });

    /* Assign a media appearance to the character */
    
    router.post('/add_media', function(req, res){
        var mysql = req.app.get('mysql');
        var mediaList = req.body.addMedia;
        var character = req.body.charID;
        for (let media of mediaList){
            console.log("Processing weapon id " + media);
            var sql = "INSERT INTO character_media (characterID, mediaID) VALUES (?, ?);";
            var inserts = [character, media];
            sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    console.log(error);
                }
            });
        }
        res.redirect('/char_update/' + character);
    });


    return router;
}();