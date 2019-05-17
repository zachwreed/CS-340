var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_reedz',
  password        : '2376',
  database        : 'cs340_reedz'
});

module.exports.pool = pool;

// host            : 'mysql.eecs.oregonstate.edu',