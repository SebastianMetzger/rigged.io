"use strict";

var activities = {
	leaveTheHouse : function(){
		// console.log("leaveTheHouse with " + arguments[0]);
		return true;
	},
	getIntoTheCar : function(){
		// console.log("getIntoTheCar with " + arguments[0]);
		return false;
	},
	getOntoTheBike : function(){
		// console.log("getOntoTheBike with " + arguments[0]);
		return true;
	},
	driveToWork : function(){
		// console.log("driveToWork with " + arguments[0]);
		return true;
	},
	startCoding : function(){
		// console.log("startCoding with " + arguments[0]);
		return true;
	},
};

function executeStep(step){
	var alternatives = step.split(' Or ');
	for(var i = 0; i < alternatives.length; i++){
		var alternative = alternatives[i];
		if(typeof activities[alternative] === 'function'){
			var ret = activities[alternative].apply(activities, []);
			// if alternative returned successful, exit loop
			if(ret){ 
				console.log(alternative + " success");
				return true;
				break;
			 } else {
			 	console.log(alternative + " fail");
			 }
		}
	}
	return false;
};

exports.process = function(dsl){
	var steps = dsl.split(' then ');
	steps.forEach(function(step){
		if(!executeStep(step)){
			console.log("Process failed");
		}
	});
};