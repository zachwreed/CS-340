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
	
	function get_quests(res, mysql, context, complete) {
		mysql.pool.query('SELECT q.q_id, q.q_name, q.q_level, r.r_name FROM eso_quests q INNER JOIN eso_regions r ON r.r_id = q.q_region', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.q_list = results;
				complete();
			}
		);
	}
	
	function get_quest(res, mysql, context, id, complete) {
		var sql = 'SELECT q_id, q_name, q_level, q_region FROM eso_quests WHERE q_id = ?';
		var insert_id = [id];
		mysql.pool.query(sql, id, 
			function(error, results, fields) {
				if (error) {
					res.write(JSON.stringify(error));
					res.end();
				}
				context.q_list = results[0]; // selects only first data set.
				complete();
			}
		);
	}
	
	function get_regions(res, mysql, context, complete) {
		mysql.pool.query('SELECT r_id, r_name, r_alliance FROM eso_regions', 
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
	
	function get_quest_char(res, mysql, context, complete) {
		mysql.pool.query('SELECT qc.id, c.c_name, q.q_name FROM eso_characters c INNER JOIN eso_quest_char qc ON c.c_id = qc.char_id INNER JOIN eso_quests q ON q.q_id = qc.quest_id ORDER BY c.c_name DESC',
						function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.qc_list = results;
				complete();
			}
		);
	}
			
				
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context= {};
		context.jsscripts = ["quest_delete.js"];
		var mysql = req.app.get('mysql');
		context.jsscripts = ["quest_delete.js"];
		get_quests(res, mysql, context, complete);
		get_regions(res, mysql, context, complete);
		get_quest_char(res, mysql, context, complete)
		var file = 'q_browse';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render(file, context);
			}
		}
	});
	
	router.get('/:id', function(req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["quest_delete.js", "quest_update.js", "q_select.js"];
		var mysql = req.app.get('mysql');
		get_quest(res, mysql, context, req.params.id, complete);
		get_regions(res, mysql, context, complete);
		get_quest_char(res, mysql, context, complete)
		var file = 'q_update';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render(file, context);
			}
		}
	});
	
	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var file = '/q_browse';
		var inserts = [req.body.q_name, req.body.q_level, req.body.q_region];
		var sql = 'INSERT INTO eso_quests (q_name, q_level, q_region) VALUES (?, ?, ?)';
		sql = mysql.pool.query(sql, inserts, 
			function(error, results, fields) {
				if(error) {
					res.write(JSON.stringify(error));
					res.end();
				}
				
				else {
					res.redirect(file);
				}
			
			}
		);	
	});
	
	router.put('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var file = 'q_browse';
		var inserts = [req.body.q_name, req.body.q_level, req.body.q_region, req.params.id];
		var sql = 'UPDATE eso_quests SET q_name = ?, q_level = ?, q_region = ? WHERE q_id = ?';
		sql = mysql.pool.query(sql, inserts, 
			function(error, results, fields) {
				if(error) {
					res.write(JSON.stringify(error));
					res.end();
				}
				
				else {
					res.status(200);
					res.end();
				}
			}
		);	
	});
	
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM eso_quests WHERE q_id = ?';
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, 
			function (error, results, fields) {
				if(error) {
					res.write(JSON.stringify(error));
					res.status(400);
					res.end();
				}
				else {
					res.status(202).end();
				}
			}
		);
	});
	
	return router;
}();