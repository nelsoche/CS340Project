var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 10,
	host            : 'classmysql.engr.oregonstate.edu',
	user            : 'cs340_nelsoche',
	password        : 'Mbmrkd317.',
    database        : 'cs340_nelsoche'
});
module.exports.pool = pool;