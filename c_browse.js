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
	
	function get_character(res, mysql, context, c_id, complete) {
		var sql = 'SELECT c_id, c_name, c_race, c_class, c_stone, c_level, c_region, c_origin_alliance FROM `eso_characters` WHERE c_id = ?';
		var inserts = [c_id];
		mysql.pool.query(sql, inserts, 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.c_list = results[0]; // selects only first data set.
				complete();
			}
		);
	}
	
	function get_character_search(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT c_id, c_name, c_race, c_class, c_stone, c_level, c_region, c_origin_alliance FROM eso_characters WHERE c_name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)
      mysql.pool.query(query, 
		function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.c_list = results;
            complete();
        });
    }
	
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
	
	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context= {};
		context.jsscripts = ["char_delete.js", "char_search.js"];
		var mysql = req.app.get('mysql');
		get_characters(res, mysql, context, complete);
		get_regions(res, mysql, context, complete);
		get_alliances(res, mysql, context, complete);
		var file = 'c_browse';
		
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
		context.jsscripts = ["char_delete.js", "char_update.js", "c_select.js"];
		var mysql = req.app.get('mysql');
		get_character(res, mysql, context, req.params.id, complete);
		get_regions(res, mysql, context, complete);
		get_alliances(res, mysql, context, complete);
		var file = 'c_update';
		
		function complete() {
			callbackCount++;
			if(callbackCount >= 3) {
				res.render(file, context);
			}
		}
	});
	
	router.delete('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM eso_characters WHERE c_id = ?';
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
	
	router.put('/:id', function(req, res) {
		var mysql = req.app.get('mysql');
		var file = 'c_browse';
		var inserts = [req.body.c_name, req.body.c_race, req.body.c_class, req.body.c_stone, req.body.c_level, req.body.c_region, req.body.c_origin_alliance, req.params.id];
		var sql = 'UPDATE eso_characters SET c_name = ?, c_race = ?, c_class = ?, c_stone = ?, c_level = ?, c_region = ?, c_origin_alliance=? WHERE c_id = ?';
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
	
	router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["char_delete.js","char_search.js"];
        var mysql = req.app.get('mysql');
        get_character_search(req, res, mysql, context, complete);
		get_alliances(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('c_browse', context);
            }
        }
    });
	
	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var file = '/c_browse';
		var inserts = [req.body.c_name, req.body.c_race, req.body.c_class, req.body.c_stone, req.body.c_level, req.body.c_region, req.body.c_origin_alliance];
		var sql = 'INSERT INTO eso_characters (c_name, c_race, c_class, c_stone, c_level, c_region, c_origin_alliance) VALUES (?, ?, ?, ?, ?, ?, ?)';
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
	
	return router;
}();