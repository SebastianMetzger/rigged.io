'user strict'

var Promise = require('promise');
var request = require('request');

var activities = {
	leaveTheHouse : function(){
		return new Promise(function (fulfill, reject){
			request('http://www.foodtrack.de/resolveCurrentWeek', function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body) // Print the google web page.
			    fulfill();
			  }
			});
	  });
	},
	getIntoTheCar : function(){
		return new Promise(function (fulfill, reject){
	  	fulfill();
	  });
	},
	getOntoTheBike : function(){
		return new Promise(function (fulfill, reject){
	  	request('http://www.foodtrack.de/resolveSubDomain', function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body) // Print the google web page.
			    fulfill();
			  }
			});
	  });
	},
	driveToWork : function(){
		return new Promise(function (fulfill, reject){
	  	fulfill();
	  });
	},
	startCoding : function(){
		return new Promise(function (fulfill, reject){
	  	fulfill();
	  });
	},
};

var executeSteps = function(steps, i, payload){
	executeParallarActivites(steps[i]).then(function(){
		console.log("Executed Async " + steps[i]);
		i++;
		if(i < steps.length){
			executeSteps(steps, i);
		}
	});
};

// execute one or more activities parallar
var executeParallarActivites = function(step, payload){
	var subSteps = step.split(' and ');
	return new Promise(function (fulfill, reject){
	  	var successCount = 0;
	  	subSteps.forEach(function(subStep){
	  		if(typeof activities[subStep] === 'function'){
	  			activities[subStep]().then(function(){
	  			successCount++;
	  			if(successCount === subSteps.length){
	  				// fullfill, when all activities returned
	  				fulfill();
	  			}
	  		});
	  		} else {
	  			console.log("Activity does not exist or is not a function: " + subStep);
	  			reject("Activity must be a function: " + subStep);
	  		}
	  	});
	  });
};

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
	executeSteps(steps, 0, payload);
};