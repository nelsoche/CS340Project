/* media update */

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get the table of media
    function getMedia(req, res, mysql, context, complete){
        console.log(req.body);
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
    router.get('/:characterID', function(req, res){
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
        var race = req.body.charRace;
        var inserts = [req.body.mediaType, req.body.title, req.body.releaseDate, synopsis, req.body.medID];
        
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

        res.redirect('/media_update/' + req.body.medID);
    });

    return router;
}();
