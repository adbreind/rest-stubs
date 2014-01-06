var express = require('express'),
    stubGenerator = require('./stub-generator');
 
var app = express();
 
app.configure(function () {
	app.use(allowCrossDomain);
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

entities = [ 'contact' ];
entities.forEach(stub);

function stub(name) {
    console.log("Stubbing: " + name);
	stubGenerator.initializeEntity(name);
	app.get('/' + name, stubGenerator.findAll(name));
	app.get('/' + name + '/:id', stubGenerator.findById(name));
	app.post('/' + name, stubGenerator.create(name));
	app.put('/' + name + '/:id', stubGenerator.update(name));
	app.delete('/' + name + '/:id', stubGenerator.delete(name));
    entities.push(name);
}

app.get("/stub-*", function(req, res) {    
    var ent = (req.path.substr(1).split("/")[0]).split("-")[1];
    if (ent && entities.indexOf(ent)==-1 && ent.indexOf(".")==-1) {
        stub(ent);
        res.end();
    }
});

//stubGenerator.initializeEntity("test", [ { id : 1, name : "First Test " } ] );
//stub("test");

app.listen(3000);
console.log('Listening on port 3000...');

function allowCrossDomain (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
}