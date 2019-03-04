const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const shortid = require("shortid");
const url = require("url");
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname,'public')));
/* app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); */
app.use(bodyParser.json({limit: '15mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '15mb', extended: true}))
app.set('view engine', 'ejs');


app.get("/", function(req,res){
	retData = {}
	retData.content="";
	retData.permalink="";
	res.render("index",retData);
});

app.post("/persist_hyp001",function(req,res){
	console.log("body: "+JSON.stringify(req.body));
	if (typeof req.body.permalink === "undefined" || req.body.permalink === "" || req.body.permalink === null){
		urlId = shortid.generate(); 
	} else {
		urlId = req.body.permalink
	}
	
	console.log("url id: "+urlId);
	req.body.permalink = urlId;
	json_obj = JSON.stringify(req.body);
	fs.writeFile(__dirname+"/data/"+urlId+".json",json_obj,"utf-8",function(err){
		if(err) throw err;
		console.log("document "+urlId+" saved!");
		retObj = {};
		retObj.permalink = urlId;
		res.send(retObj);
	});
});

app.get('/doc*',function(req,res){
	var urlObj = url.parse(req.url,true);
	docId = urlObj.path.split('__')[1];
	let rawData = fs.readFileSync(__dirname+"/data/"+docId+".json","utf-8",function(err){
		if(err) throw err;
	});
	let retData = JSON.parse(rawData);
	retData.createNew = false;
	console.log(JSON.stringify(retData))
	res.render("index",retData);
});

app.get("/faq", function(req,res){
	res.render("faq");
});

var server = app.listen(8080,function(){
	var host = server.address().address
	var port = server.address().port
	console.log("app listening at http://%s:%s",host,port)
})