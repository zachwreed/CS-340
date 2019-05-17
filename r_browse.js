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
	
	// Load sql eso_regions to context.r_list
	
	function get_regions(res, mysql, context, complete) {
		mysql.pool.query('SELECT r.r_id, r.r_name, a.a_name FROM eso_regions r INNER JOIN eso_alliances a ON a.a_id = r.r_alliance', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.r_list = results;
				complete();
			}
		);
	}
	
	// Load sql individual region to context.r_list
	
	function get_region(res, mysql, context, id, complete) {
		var sql = 'SELECT r_id, r_name, r_alliance FROM eso_regions WHERE r_id = ?';
		var sql_id = [id];
		mysql.pool.query(sql, sql_id, 
			function(error, results, fields) {
				if (error) {
					res.write(JSON.stringify(error));
					res.end;
				}
				context.r_list = results[0]; // selects only first data set.
				complete();
			}
		);
	}
	
	// Load sql eso_char_in_reg to context.cr_list

	function get_char_reg(res, mysql, context, complete) {
		mysql.pool.query('SELECT c.c_name, r.r_name FROM eso_characters c INNER JOIN eso_regions r ON r.r_id = c.c_region ORDER BY r.r_name DESC',
			function(error, results, fields) {
				if(error) {
					res.write(JSON.stringify(error));
					res.end;
				}
				context.cr_list = results;
				complete();
			}
		);		
	}
	
	// Load sql eso_alliances to context.a_list
	
	function get_alliances(res, mysql, context, complete) {
		mysql.pool.query('SELECT a_id, a_name FROM eso_alliances', 
			function(error, results, fields) {
				if(error) {
					res.write(JSON.stringify(error));
					res.end();
				}
				context.a_list = results;
				complete();
			}
		
		);
	}
	
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context= {};
		//context.jsscripts = ["r_delete.js", "r_search.js"];
		var mysql = req.app.get('mysql');
		get_regions(res, mysql, context, complete);
		get_alliances(res, mysql, context, complete);
		get_char_reg(res, mysql, context, complete)
		var file = 'r_browse';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render(file, context);
			}
		}
	});
	
	// router.get('/:id', function(req, res) {
		// var mysql = req.app.get('mysql');
		// var file = 'r_browse';
		// var inserts = [req.body.r_name, req.body.r_alliance, req.params.id];
		// var sql = 'UPDATE eso_regions SET r_name = ?, r_alliance = ? = ?WHERE r_id = ?';
		// sql = mysql.pool.query(sql, inserts, 
			// function(error, results, fields) {
				// if(error) {
					// res.write(JSON.stringify(error));
					// res.end();
				// }
				
				// else {
					// res.status(200);
					// res.end();
				// }
			// }
		// );	
	// });
	
	// router.post('/', function(req, res) {
		// var mysql = req.app.get('mysql');
		// var file = '/r_browse';
		// var inserts = [req.body.q_name, req.body.q_level, req.body.q_region];
		// var sql = 'INSERT INTO eso_regions (r_name, r_alliance) VALUES (?, ?)';
		// sql = mysql.pool.query(sql, inserts, 
			// function(error, results, fields) {
				// if(error) {
					// res.write(JSON.stringify(error));
					// res.end();
				// }
				
				// else {
					// res.redirect(file);
				// }
			
			// }
		// );	
	// });
	
	return router;
}();