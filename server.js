var express = require('express'),
    stubGenerator = require('./stub-generator');
 
var app = express();
 
app.configure(function () {
	app.use(allowCrossDomain);
    app.use(express.logger('dev'));
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

    var update = stubGenerator.update(name);
    app.post('/' + name + '/:id', update);
	app.put('/' + name + '/:id', update);
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

stubGenerator.initializeEntity("book", [{"title":"Great Expectations","id":"2"},{"title":"Bleak House","id":"4"}]);
stub("book");

stubGenerator.initializeEntity("contact", [
            {"first":"Joe","last":"Smith","email":"joe@gmail.com","id":1,
                company_id:"xyz", lotteryWinner : false },
            {"first":"Joe2","last":"Smith2","email":"joe2@gmail.com","id":2,
                company_id:"abc", lotteryWinner : false },
            {"first":"Joe3","last":"Smith3","email":"joe3@gmail.com","phone":"555-1212",
                "id":3, company_id:"xyz", lotteryWinner : false}
        ]);
stub("contact");

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