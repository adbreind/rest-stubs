var fakeDatabase = {};
/* this is a map of entity name to an array of objects
 e.g. { food : [
			{
				name: "apple",
				id : 21
			},
			{
				name: "fries",
				id : 24
			}]
		} 
 etc. */

equals = function(field, val, obj) { return obj[field] == val };

equalsId = equals.bind(undefined, "id");

log = function() {
	console.log(JSON.stringify(fakeDatabase));
};

idSeed = 1;

exports.initializeEntity = function(name) {
	fakeDatabase[name] = [];
};
	
exports.findAll = function(name) {
	return function(req, res) {
		res.send(fakeDatabase[name]);
	}
};
	
exports.findById = function(name) {
	return function(req, res) {
		var id = req.params.id;
		console.log('Retrieving ' + name + ': ' + id);
		var found = fakeDatabase[name].filter(equalsId.bind(undefined, id))[0];
		res.send(found ? found : []);
	}
};

exports.create = function(name) {
	return function(req, res) {		
		var entity = req.body;
		var records = fakeDatabase[name];
		entity.id = idSeed++;
		console.log('Adding ' + name + ': ' + JSON.stringify(entity));
		records.push(entity);
		res.send(entity);
	}
}
 
exports.update = function(name) {
	return function(req, res) {
		var id = req.params.id;
		var entity = req.body;
		console.log('Updating ' + name + ': ' + id);
		console.log(JSON.stringify(entity));
		var found = fakeDatabase[name].filter(equalsId.bind(undefined, id))[0];
		for (var k in entity)
			found[k] = entity[k];
		res.send(entity);
	}
}
 
exports.delete = function(name) {
	return function(req, res) {
		var id = req.params.id;
		console.log('Deleting ' + name + ': ' + id);
		var records = fakeDatabase[name];
		var found = records.filter(equalsId.bind(undefined, id))[0];
		records.splice(records.indexOf(found),1);
		res.end();
	}
}