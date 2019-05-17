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
		mysql.pool.query('SELECT q_id, q_name, q_level, q_region FROM eso_quests', 
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
	
	function get_characters(res, mysql, context, complete) {
		mysql.pool.query('SELECT c.c_id, c.c_name, c.c_race, c.c_class, c.c_stone, c.c_level, r.r_name, a.a_name FROM eso_characters c INNER JOIN eso_regions r ON c.c_region = r.r_id INNER JOIN eso_alliances a ON c.c_origin_alliance = a.a_id ORDER BY c.c_id', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.c_list = results;
				complete();
			}
		);
	}
	
	function get_quest_chars(res, mysql, context, complete) {
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
	
	function get_quest_char(res, mysql, context, id, complete) {
		var sql = 'SELECT qc.id, qc.char_id, qc.quest_id, c.c_name, q.q_name FROM eso_characters c INNER JOIN eso_quest_char qc ON c.c_id = qc.char_id INNER JOIN eso_quests q ON q.q_id = qc.quest_id WHERE qc.id = ?';
		var inserts = [id];
		mysql.pool.query(sql, inserts, 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.qc_list = results[0]; // selects only first data set.
				complete();
			}
		);
	}
				
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context= {};
		context.jsscripts = ["quest_char_delete.js"];
		var mysql = req.app.get('mysql');
		get_quests(res, mysql, context, complete);
		get_characters(res, mysql, context, complete);
		get_quest_chars(res, mysql, context, complete)
		var file = 'qc_browse';
		
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
		context.jsscripts = ["quest_char_delete.js", "quest_char_update.js", "qc_select.js"];
		var mysql = req.app.get('mysql');
		get_quests(res, mysql, context, complete);
		get_characters(res, mysql, context, complete);
		get_quest_char(res, mysql, context, req.params.id, complete)
		var file = 'qc_update';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render(file, context);
			}
		}
	});
	
	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var file = '/qc_browse';
		var inserts = [req.body.char_id, req.body.quest_id];
		var sql = 'INSERT INTO eso_quest_char (char_id, quest_id) VALUES (?, ?)';
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
		var file = 'qc_browse';
		var inserts = [req.body.char_id, req.body.quest_id, req.params.id];
		var sql = 'UPDATE eso_quest_char SET char_id = ?, quest_id = ? WHERE id = ?';
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
		var sql = 'DELETE FROM eso_quest_char WHERE id = ?';
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