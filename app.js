'user strict'

var stepper = require('./main.js');
var stepperAsync = require('./mainAsync.js');
var stepperGenerator = require('./mainGenerator.js');

// stepper.process('leaveTheHouse then getIntoTheCar Or getOntoTheBike then driveToWork then startCoding');

// stepperAsync.registerWorkflow('onWakeUpCall', '{data}leaveTheHouse then getIntoTheCar and getOntoTheBike then driveToWork then startCoding');
// stepperAsync.fireEvent('onWakeUpCall',{data: 1});

stepperGenerator.registerWorkflow('onWakeUpCall', '{data, id}leaveTheHouse{data} then {data}getIntoTheCar{data} and {data}getOntoTheBike{data} then {data}driveToWork{data} then {data}startCoding{data}');
stepperGenerator.fireEvent('onWakeUpCall',{data: 1, id: 2});

// function *test(){
// 	var text = "test";
// 	var ret = "";
// 	while(true){
// 		ret = yield text;
// 		console.log(ret);
// 	}
// };

// var invocation = test();
// console.log(invocation.next("answer"));
// console.log(invocation.next("answer1"));
// console.log(invocation.next("answer2"));
// console.log(invocation.next("answer3"));
// console.log(invocation.next("answer4"));