/***************************************
** Author: Zach Reed
** Description: r_browse script
****************************************/

// Personal notes for reminders
// https://nodejs.org/api/modules.html#modules_module_exports
// https://www.w3schools.com/nodejs/nodejs_modules.asp equivalent to JS libraries

module.exports = function () { // will be exposed as a module
	var express = require('express');
	var router = express.Router(); // https://expressjs.com/en/guide/routing.html
	
	function get_alliances(res, mysql, context, complete) {
		mysql.pool.query('SELECT a_id, a_name FROM eso_alliances', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.a_list = results;
				complete();
			}
		);
	}
	
	function get_alliance(res, mysql, context, id, complete) {
		var sql = 'SELECT a_id, a_name FROM eso_alliances WHERE q_id = ?';
		var insert_id = [id];
		mysql.pool.query(sql, id, 
			function(error, results, fields) {
				if (error) {
				res.write(JSON.stringify(error));
				res.end();
				}
				context.a_list = results[0]; // selects only first data set.
				complete();
			}
		);
	}
	
	
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context= {};
		context.jsscripts = ["a_delete.js"];
		var mysql = req.app.get('mysql');
		get_alliances(res, mysql, context, complete);
		var file = 'a_browse';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 1) {
				res.render(file, context);
			}
		}
	});
	
	router.get('/:id', function(req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["a_delete.js"];
		var mysql = req.app.get('mysql');
		get_alliance(res, mysql, context, req.params.a_id, complete);
		var file = 'a_update';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 1) {
				res.render(file, context);
			}
		}
	});
		
	return router;
}();