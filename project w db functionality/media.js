module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get the table of media
    function getMedia(res, mysql, context, complete){
        mysql.pool.query("SELECT media.mediaID, title, mediaType, DATE_FORMAT(releaseDate, '%M %e %Y') AS releaseDate, synopsis FROM media", function(error, results, fields){
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
        var query = "SELECT media.mediaID, title, mediaType, DATE_FORMAT(releaseDate, '%M %e %Y') AS releaseDate, synopsis FROM media";
        console.log(req.params);

        if(req.params.sortBy == "1"){
            query += " ORDER BY title ASC";
        }else if(req.params.sortBy == "2"){
            query += " ORDER BY title DESC";
        }else if(req.params.sortBy == "3"){
            query += " ORDER BY mediaType, title ASC";
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
    function getMediaByType(req, res, mysql, context, complete){
        var query = "SELECT media.mediaID, title, mediaType, DATE_FORMAT(releaseDate, '%M %e %Y') AS releaseDate, synopsis FROM media WHERE media.mediaType = ?";
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

    // Get characters for each piece of media
    function getMediaChar(res, mysql, context, complete){
        mysql.pool.query("SELECT media.mediaID, characters.characterName FROM media INNER JOIN character_media ON media.mediaID = character_media.mediaID INNER JOIN characters ON character_media.characterID = characters.characterID ORDER BY mediaID", function(error, results, fields){
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
        getMedia(res, mysql, context, complete);
        getMediaChar(res, mysql, context, complete);
        function complete(){
            callbackCount++;

            if(callbackCount >= 2){
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
        getMediaChar(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('media', context);
            }
        }
    });

    // Filter by media type
    router.get('/filter/:mediaType', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Media";
        var mysql = req.app.get('mysql');
        getMediaByType(req, res, mysql, context, complete);
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
        var synopsis = req.body.synopsis;
        if(synopsis == ""){
            synopsis = null;
        }
        var inserts = [req.body.mediaType, req.body.mediaTitle, req.body.releaseDate, synopsis];
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
