var express = require('express');
var router = express.Router();
var mdPath = 'markdown';
var marked = require('marked'); 


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

var fs = require("fs");
var pp = require("properties-parser");


router.get('/', function(req, res){
  var file = fs.readdirSync(mdPath);  
  res.render('markdown', {"mdFiles": file, "mdContent": "<h1 class='title_center'>Welcome to markdown-reader</h1>", fileName: ""});
});

/* md page. */
router.get('/markdown/:file', function(req, res) {
  var file = fs.readdirSync(mdPath);
  var mdFile = fs.readFileSync( mdPath + "/" + req.param('file') ,"utf-8");
  var html = marked(mdFile);
  res.render('markdown', {"mdFiles": file, "mdContent": html, "fileName": req.param('file')});
});

/* setting */
router.get('/settings', function(req, res){
  var editor = pp.createEditor("settings.properties");
  var nightMode = editor.get("nightMode");
  var shrink = editor.get("shrink");
  var fontSize = editor.get("fontSize");
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  res.send({nightMode: nightMode, shrink: shrink, fontSize: fontSize});
});

router.post('/settings/save', function(req, res){
  var editor = pp.createEditor("settings.properties");
  editor.set(req.body.key, req.body.value);
  editor.save();
  res.send("save setting success");
});
module.exports = router;
