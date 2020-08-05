/* Races js file */

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get the table of races
    function getRaces(res, mysql, context, complete){
        mysql.pool.query("SELECT raceName FROM races ORDER BY raceName ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.races = results;
            complete();
        });
    }

    // Display all races
    router.get('/', function(req, res){
        var context = {};
        context.pageTitle = "Races";
        var mysql = req.app.get('mysql');
        getRaces(res, mysql, context, complete);

        function complete(){
            res.render('races', context);
        }
    });

    // Add a race to the database
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO races (raceName) VALUES (?)";
        var inserts = [req.body.raceName];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/races');
            }
        });
    });

    return router;
}();
