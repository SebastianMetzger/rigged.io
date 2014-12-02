"use strict";

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

var executeSteps = function(steps, i){
	executeParallarActivites(steps[i]).then(function(){
		console.log("Executed Async " + steps[i]);
		i++;
		if(i < steps.length){
			executeSteps(steps, i);
		}
	});
};

var executeParallarActivites = function(step){
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
	  			reject("Activity must be a function: " + subStep);
	  		}
	  	});
	  });
};

exports.process = function(dsl){
	var steps = dsl.split(' then ');
	executeSteps(steps, 0);
};