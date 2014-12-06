"use strict";
var request = require('request');

var activities = {
	leaveTheHouse : function(){
		return function(cb){
			cb(null, 'leaveTheHouse  DONE');
		};
	},
	getIntoTheCar : function(){
		return function(cb){
			request('http://www.foodtrack.de/resolveCurrentWeek', function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body) // Print the google web page.
			    cb(null, 'getIntoTheCar DONE');
				};
			});
			}
	},
	getOntoTheBike : function(){
		return function(cb){
			cb(null, 'getOntoTheBike DONE');
		};
	},
	driveToWork : function(){
		return function(cb){
			cb(null, 'driveToWork DONE');
		};
	},
	startCoding : function(){
		return function(cb){
			cb(null, 'startCoding DONE');
		};
	},
};

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

// var produceTestFunction = function(res){
// 	return function(cb){
// 		cb(null, res);
// 	};
// }

// var testFunctions = [];
// testFunctions.push(produceTestFunction("test0"));
// testFunctions.push(produceTestFunction("test1"));
// testFunctions.push(produceTestFunction("test2"));
// testFunctions.push(produceTestFunction("test3"));

// async activity runner
// run(function* () {
//   try {
//     for(var i = 0; i < testFunctions.length; i++){
// 	    console.log(yield testFunctions[i]);
//     }
//   }
//   catch (er) {
//     console.error(er);
//   }
// });

function stepParallel(subSteps, payload){
		return function(cb){
			var callNbr = 0;
			for(var y = 0;y < subSteps.length; y++){
				activities[subSteps[y]]()(function(err, ret){
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

exports.registerWorkflow = function(event, workflow){
	if(typeof event !== 'string') throw 'Event must be a String';
	if(typeof event !== 'string') throw 'workflow must be a String';
	registeredWorkflows[event] = workflow;
};
exports.fireEvent = function(event, payload){
	if(typeof event !== 'string') throw 'Event must be a String';
	if(!payload) payload = {};
	var workflow = registeredWorkflows[event];
	var steps = workflow.split(' then ');
	run(stepLinear(steps, payload));
};