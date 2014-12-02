"user strict";
var stepper = require('./main.js');
var stepperAsync = require('./mainAsync.js');

stepper.process('leaveTheHouse then getIntoTheCar Or getOntoTheBike then driveToWork then startCoding');
stepperAsync.process('leaveTheHouse then getIntoTheCar and getOntoTheBike then driveToWork then startCoding');