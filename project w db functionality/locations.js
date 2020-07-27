module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Get the table of locations */
    
    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT locationName FROM locations ORDER BY locationName ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    /*Display all locations*/

    router.get('/', function(req, res){
        var context = {};
        context.pageTitle = "Locations";
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        function complete(){
            res.render('locations', context);
        }
    });

    /* Add a location to the database */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO locations (locationName) VALUES (?)";
        var inserts = [req.body.locName];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/locations');
            }
        });
    });

    return router;
}();