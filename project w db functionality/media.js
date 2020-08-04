module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get the table of media
    function getMedia(res, mysql, context, complete){
        mysql.pool.query("SELECT media.mediaID, title, mediaType, releaseDate FROM media", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.media = results;
            complete();
        });
    }

    // Get list of all characters (only id, name, and actors' names)
    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT characterID, characterName, actorName1, actorName2 FROM characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.media = results;
            complete();
        });
    }

    // Sort media by: A-Z, Z-A, or Media Type
    function getSortedMedia(req, res, mysql, context, complete){
        var query = "SELECT media.mediaID, title, mediaType, releaseDate FROM media";
        console.log(req.params);

        if(req.params.sortBy == "1"){
            query += "ORDER BY media.title ASC";
        }else if(req.params.sortBy == "2"){
            query += "ORDER BY media.title DESC";
        }else if(req.params.sortBy == "3"){
            query += "ORDER BY media.mediaType ASC";
        }

        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.media = results;
            complete();
        });
    }

    // Filter media based on mediaType
    function getMediabyType(req, res, mysql, context, complete){
        var query = "SELECT media.mediaID, title, mediaType, releaseDate FROM media WHERE media.mediaType = ?";
        console.log(req.params);
        var inserts = [req.params.mediaType];
        
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.media = results;
            complete();
        });
    }

    // Get characters for each peice of media
    function getMediaChar(res, mysql, context, complete){
        mysql.pool.query("SELECT media.mediaID AS medID, characters.characterName FROM characters INNER JOIN characterName ON media.mediaID = media_characters.mediaID INNER JOIN characters ON characters.charactersID = media_characters.mediaID ORDER BY medID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.mediaChars = results;
            complete();
        });
    }

    //Display all current media
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Media";
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
                res.render('media', context);
            }
        }
    });

    // Sort media by criteria from dropdown selection
    router.get('/sort/:sortBy', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Media";
        var mysql = req.app.get('mysql');

        getSortedMedia(req, res, mysql, context, complete);
        getMediabyType(res, mysql, context, complete);

        function complete(){
            callbackCount++;

            if(callbackCount >= 2){
                res.render('media', context);
            }
        }
    });

    // Filter by media type
    router.get('/filter/media/:media', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Media";
        var mysql = req.app.get('mysql');

        getMediabyType(req, res, mysql, context, complete);
        getMediaChar(res, mysql, context, complete);

        function complete(){
            callbackCount++;

            if(callbackCount >= 2){
                res.render('media', context);
            }
        }
    });

    // Add media to the database
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO media (mediaType, title, releaseDate, synopsis) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.medType, req.body.title, req.body.releaseDate];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/media');
            }
        });
    });

    // Delete media from the database
    router.delete('/:mediaID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM media WHERE mediaID = ?";
        var inserts = [req.params.mediaID];
        
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
