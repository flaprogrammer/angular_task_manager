var express = require('express');
var router = express.Router();
var fs = require('fs');
var filename = './public/tasks.json'

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title: 'Express'
	});
});

router.post('/edit', function(req, res) {
	var new_cols = req.body;
	var file_content = fs.readFileSync(filename);
	var content = JSON.parse(file_content);
	fs.writeFileSync(filename, JSON.stringify(new_cols));

	res.send({
		res: 'ok'
	});
});

router.post('/add_task', function(req, res) {
	var new_task = req.body;
	var file_content = fs.readFileSync(filename);
	var content = JSON.parse(file_content);
	content[0].tasks.push(new_task);
	fs.writeFileSync(filename, JSON.stringify(content));

	res.send({
		res: 'ok'
	});
});

router.post('/remove_task', function(req, res) {
	var remove_index = req.body.removeIndex;
	var remove_col = req.body.removeCol;

	var file_content = fs.readFileSync(filename);
	var content = JSON.parse(file_content);
	content[remove_col].tasks.splice(remove_index,1);
	fs.writeFileSync(filename, JSON.stringify(content));

	res.send({
		res: 'ok'
	});
});

router.post('/change_col', function(req, res) {
	var col_key = req.body.colKey;
	var new_name = req.body.newName;

	var file_content = fs.readFileSync(filename);
	var content = JSON.parse(file_content);
	content[col_key].name = new_name;
	fs.writeFileSync(filename, JSON.stringify(content));

	res.send({
		res: 'ok'
	});
});

module.exports = router;