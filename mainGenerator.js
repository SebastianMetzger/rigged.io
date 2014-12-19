'user strict'

var request = require('request');

var activities = {
	leaveTheHouse : function(inputs){
		return function(cb){
			console.log(inputs.data);
			cb(null, 'leaveTheHouse  DONE');
		};
	},
	getIntoTheCar : function(inputs){
		return function(cb){
			console.log(inputs.data);
			request('http://www.foodtrack.de/resolveCurrentWeek', function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body) // Print the google web page.
			    cb(null, 'getIntoTheCar DONE');
				};
			});
			}
	},
	getOntoTheBike : function(inputs){
		return function(cb){
			console.log(inputs.data);
			cb(null, 'getOntoTheBike DONE');
		};
	},
	driveToWork : function(inputs){
		return function(cb){
			console.log(inputs.data);
			cb(null, 'driveToWork DONE');
		};
	},
	startCoding : function(inputs){
		return function(cb){
			console.log(inputs.data);
			cb(null, 'startCoding DONE');
		};
	},
};

/**
 * Code partially taken from: http://strongloop.com/strongblog/how-to-generators-node-js-yield-use-cases/
 */
function thunkify (nodefn) { 
	// First return function without callback
  return function () {
    var args = Array.prototype.slice.call(arguments);
    // Only once the runner added the callback, make the actual async call
    return function (cb) {
    	// add cb function at the end 
      args.push(cb);
      // Actual async call
      nodefn.apply(this, args);
    }
  }
}

function run (gen) {
	// initial call to get function into suspended state
  // var gen = genFn();

  // jump to first yield inside runned function
  next();

 	// jump from yield to yield asynchrounosly until no more yield in run function
  function next (er, value) {
    if (er) return gen.throw(er);
    var continuable = gen.next(value);
    if (continuable.done) return; 
    var cbFn = continuable.value; 
    cbFn(next);
  }
}

function parseDataInterface(data){
	var attributes = [];
	if(data.length > 2){
		data = data.substring(1, data.length-1);
		var tokens = data.split(',');
		for(var i = 0; i < tokens.length; i++){
			var token = tokens[i];
			attributes.push(token);
		}
	}
	return attributes;
}

// Self resolving control flow
function stepParallel(subSteps, payload){
		return function(cb){
			var callNbr = 0;
			for(var y = 0;y < subSteps.length; y++){
				var subStep = subSteps[y];
				// get everything in between curly braces
				var data = subStep.match(/{([^}]*)}/g);
				var inputs = parseDataInterface(data[0]);
				var outputs = parseDataInterface(data[1]);
				var inputsPayload = {};
				inputs.forEach(function(name){
					var value = payload[name];
					if(value){
						inputsPayload[name] = value;
					} else {
						console.warn('Missing value ' + name);
					}
				});
				// get activity wrapped in curly braces
				var activity = /}(.*){/.exec(subStep);
				activities[activity[1]](inputsPayload)(function(err, ret){
					if(err) throw err;
					console.log(ret);
					callNbr++;
					if(callNbr === subSteps.length){
						cb(null, 'parallel DONE');
					}
				});
			}
		};
}

function* stepLinear(steps, payload){
	for(var i = 0; i < steps.length; i++){
		var subSteps = steps[i].split(' and ');
		yield stepParallel(subSteps, payload);
	}
}

var registeredWorkflows = {};
// EXPORTS
// register an event with its workflow
exports.registerWorkflow = function(event, workflow){
	if(typeof event !== 'string') throw 'Event must be a String';
	if(typeof event !== 'string') throw 'workflow must be a String';
	registeredWorkflows[event] = workflow;
};
// receive an event from
exports.fireEvent = function(event, payload){
	if(typeof event !== 'string') throw 'Event must be a String';
	if(!payload) payload = {};
	var workflow = registeredWorkflows[event];
	var steps = workflow.split(' then ');
	run(stepLinear(steps, payload));
};