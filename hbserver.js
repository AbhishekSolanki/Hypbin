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
	retData.content=""; //actual content
	retData.permalink=""; //unique link
	retData.createNew = true; // aids in indentifying opened existing document or working on new ; clipboard copy
	res.render("index",retData);
});

app.put("/persist_hyp001",function(req,res){
	//console.log("body: "+JSON.stringify(req.body));
	// if there is no permalink then it is new document and requires id
	if (typeof req.body.permalink === "undefined" || req.body.permalink === "" || req.body.permalink === null){
		urlId = shortid.generate(); 
		console.log("new permalink: "+urlId);
	} else {
		urlId = req.body.permalink
		console.log("modified request for permalink: "+urlId);
	}
	req.body.permalink = urlId;
	json_obj = JSON.stringify(req.body);
	fs.writeFile(__dirname+"/data/"+urlId+".json",json_obj,"utf-8",function(err){
		if(err) throw err;
		console.log("document persisted: "+urlId);
		retObj = {};
		retObj.permalink = urlId;
		retObj.createNew = false;
		res.send(retObj);
	});
});

app.delete("/delete_hyp001",function(req,res){
	//console.log("body: "+JSON.stringify(req.body));
	urlId = req.body.permalink
	console.log("delete request for: "+urlId);
	json_obj = JSON.stringify(req.body);
	try{
		fs.unlink(__dirname+"/data/"+urlId+".json",function(err){
			if(err) console.log(err);
		});
		console.log("deleted permalink: "+urlId);
		retObj = {};
		retObj.permalink = urlId;
		retObj.createNew = false;
		res.send(retObj);
	}catch(err){
		console.log("file not found: "+urlId);
		res.render("404");
	}
	
});

app.get('/doc*',function(req,res){
	var urlObj = url.parse(req.url,true);
	docId = urlObj.path.split('__')[1];
	console.log("visited permalink: "+docId);
	var rawData;
	try {
		rawData = fs.readFileSync(__dirname+"/data/"+docId+".json","utf-8");
		let retData = JSON.parse(rawData);
		retData.createNew = false;
		//console.log(JSON.stringify(retData))
		res.render("index",retData);
	} catch(err) {
		if(err.code === 'ENOENT'){
			console.log("file not found: "+docId);
		} 
		res.render("404");
	}
	
});

app.get("/faq", function(req,res){
	res.render("faq");
});

var server = app.listen(80,function(){
	var host = server.address().address
	var port = server.address().port
	console.log("app listening at http://%s:%s",host,port)
})
