var app = require("../../../modules/supports/webpack-dev-web-test");

var fs = require('fs');
var Busboy = require('busboy');

app.start({}, function(app){
	app.post('/upload', function(req, resp) {
		var busboy = new Busboy({ headers: req.headers });
		
		var fileName;
		
	    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
	    	console.log('Upload File [' + fieldname + ']: filename: ' + filename + ' ...');
	        
	        var saveToDir = __dirname + '/.tmp';
	        try{
	        	fs.accessSync(saveToDir, fs.R_OK | fs.W_OK);
	        }catch(ex){
		    	fs.mkdirSync(saveToDir);
	        }
	        file.pipe(fs.createWriteStream(saveToDir+"/"+filename));

	        fileName = filename;
	    });
	    busboy.on('finish', function() {
	    	resp.send('{"url": "/uploaded/'+fileName+'", "fileName": "'+fileName+'"}');
	        resp.end();
	    });
	    return req.pipe(busboy);
    });
	
	app.get('/uploaded/:filename', function (req, res) {
		console.log('Download file [' + req.params.filename + '] ...');
		
		var saveToDir = __dirname + '/.tmp';
        res.sendFile(saveToDir + "/" + req.params.filename);
    });

});
