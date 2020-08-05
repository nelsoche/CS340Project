/* media update */

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get information for specific piece of media
    function getMedia(req, res, mysql, context, complete){
        var query = "SELECT mediaID, mediaType, title, DATE_FORMAT(releaseDate, '%Y-%m-%d') AS releaseDate, synopsis FROM media WHERE mediaID = ?";
        var inserts = [req.params.mediaID];
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.media = results;
            complete();
        });
    }

    // Display current media information  
    router.get('/:mediaID', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.pageTitle = "Update Media";
        var mysql = req.app.get('mysql');
        getMedia(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('media_update', context);
            }
        }
    });

    // Submit updates to media data
    router.post('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE media SET mediaType = ?, title = ?, releaseDate = ?, synopsis = ? WHERE mediaID = ?";
        var synopsis = req.body.synopsis;
        if(synopsis == ""){
            synopsis = null;
        }
        var inserts = [req.body.mediaType, req.body.mediaTitle, req.body.releaseDate, synopsis, req.body.mediaID];
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

        res.redirect('/media_update/' + req.body.mediaID);
    });

    return router;
}();
