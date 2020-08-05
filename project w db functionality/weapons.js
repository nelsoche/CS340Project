/* Weapons js file */

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Get the table of weapons
    function getWeapons(res, mysql, context, complete){
        mysql.pool.query("SELECT weaponsName FROM weapons ORDER BY weaponName ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.weapons = results;
            complete();
        });
    }

    // Display all weapons
    router.get('/', function(req, res){
        var context = {};
        context.pageTitle = "Weapons";
        var mysql = req.app.get('mysql');
        getWeapons(res, mysql, context, complete);

        function complete(){
            res.render('weapons', context);
        }
    });

    // Add a weapons to the database
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO weapons (weaponName) VALUES (?)";
        var inserts = [req.body.weapName];

        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/weapons');
            }
        });
    });

    return router;
}();
