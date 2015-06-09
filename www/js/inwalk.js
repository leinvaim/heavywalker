angular.module('starter')

.controller('InWalkCtrl', function($scope, $ionicModal, $state, $rootScope, $http, $cordovaDeviceMotion, $ionicPlatform,
    pedometerService, goalService) {
    
    $scope.user = JSON.parse(window.localStorage.userID);
    
    $scope.isPaused = true;
    $scope.isStarted = false;
    
    $scope.accelerometer = {};
    $scope.pedometer = {};
    var watch = null;
    var options = {
        frequency: 100 // milliseconds
    };

    $scope.currentWalkingVelocity = 0; // m/s
    $scope.currentSteppingVelocity = 0; // m/s
    $scope.dangerToWellBeingRatio = 0;
    $scope.workingRatioValues = [];
    $scope.wellBeingStatus = "Not enough data collected"; // some data must be collected first
    $scope.isXNegative = false;
    $scope.isZNegative = false;
    $scope.isAlreadyWalking = false;
    
    var GRAVITY = 9.8, // m/s^2
        ACCELEROMETER_SENSITIVITY = 0.2, // m/s^2
        TIME_TO_TAKE_AVG_OVER = 5000; // milliseconds

    var urlGet = 'http://heavywalkersapi.esy.es/getLatestAlgorithmValues';
    $http.get(urlGet).then(function(response) {
        $scope.algorithmValues = response.data;
    });

    $scope.pause = function() {
        $scope.isPaused = true;
        $scope.isStarted = false;
        watch.clearWatch();
        watch = null;
        $scope.currentWalkingVelocity = 0; // m/s
        $scope.currentSteppingVelocity = 0; // m/s
        $scope.dangerToWellBeingRatio = 0;
        $scope.workingRatioValues = [];
        $scope.wellBeingStatus = "Not enough data collected"; // some data must be collected first
        $scope.isXNegative = false;
        $scope.isZNegative = false;
        $scope.isAlreadyWalking = false;
    };
    $scope.start = function() {
        $scope.isPaused = false;
        $scope.isStarted = true;
        startMonitor();
    };

    pedometerService.startUpdates();

    $scope.pedometer = pedometerService;
    $scope.goal = goalService;


    /*******************************************
     * Start Monitor
     * Use device accelerometer and return acceleration values
     * return x,y,z, timestamp
     ********************************************/
    startMonitor();

    function startMonitor() {
        watch = $cordovaDeviceMotion.watchAcceleration(options);
        document.addEventListener("deviceready", function() {
            if ($scope.isStarted) {
                watch.then(
                    null,
                    function(error) {
                        // An error occurred
                        console.log('Accelerometer Error', error);
                    },
                    function(result) {
                        $scope.accelerometer.X = result.x;
                        $scope.accelerometer.Y = result.y;
                        $scope.accelerometer.Z = result.z;
                        $scope.accelerometer.timeStamp = result.timestamp;
                        // if(result.x > 6){
                        //     showAlert();
                        // }
                        
                        updateWellbeing();
                    });
            }

        }, false);
    }


    var isAlert = false;

    function alertDismissed() {
        // do something
        isAlert = false;
        console.log('alertDismissed');
    }

    // Show a custom alertDismissed
    //
    function showAlert(message, title, buttonName) {
        $scope.pause();
        navigator.notification.alert(
            message,
            alertDismissed, // callback
            title,
            "Close"
        );
        navigator.notification.beep(3);
        navigator.notification.vibrate(4000);
        //navigator.notification.vibrate([1000, 500, 1000, 500, 1000]);
    }

    //$scope.showAlert = showAlert;

    // Updates the danger to well-being ratio of a user
    function updateWellbeing() {
        // Get user BMI based upon weight and height, BMI = weight(kg) / height(m)^2
        var userBMI = $scope.user.weight / (Math.pow($scope.user.height / 100, 2)); // height is stored in cms
         
         // Get critical walking speed based on user BMI
         var thisCriticalWalkingSpeed = userBMI > $scope.algorithmValues.critical_bmi ? 
            $scope.algorithmValues.critical_walking_speed_obese : 
            $scope.algorithmValues.critical_walking_speed_healthy;
                    
         // TODO change algorithm values from web service to camel case
        var thisDangerToWellBeingRatio = (userBMI / $scope.algorithmValues.critical_bmi) * 
            (Math.abs(getCurrentWalkingVelocity()) / thisCriticalWalkingSpeed) *
            (Math.abs(getCurrentSteppingVelocity()) / $scope.algorithmValues.critical_stepping_velocity);
         
         $scope.workingRatioValues.unshift(thisDangerToWellBeingRatio);
         
         // Is there enough working ratio values to calculate overall danger to well being ratio   
         if ($scope.workingRatioValues.length >= TIME_TO_TAKE_AVG_OVER / options.frequency) {
             var ratioSum = 0;
             
             // Get average ratio from working values
             for (var i in $scope.workingRatioValues) {
                 ratioSum += $scope.workingRatioValues[i];
             }
             
             $scope.dangerToWellBeingRatio = ratioSum / $scope.workingRatioValues.length;
             $scope.workingRatioValues.pop(); // remove last value
             showAlertIfInDanger();
        }
/*

// Hardcoded at this stage to test, to be replace with logged in user details
        // TODO change algorithm values from service to camel case
        $scope.dangerToWellBeingRatio = (userBMI / $scope.algorithmValues.critical_bmi) *
            (getCurrentWalkingVelocity() / thisCriticalWalkingSpeed) *
            (getCurrentSteppingVelocity() / $scope.algorithmValues.critical_stepping_velocity);

        // Lets do some logging!!!
        console.log('Current Walking Velocity', $scope.currentWalkingVelocity);
        console.log('Current Stepping Velocity', $scope.currentSteppingVelocity);

        console.log('wellBeingratio', $scope.dangerToWellBeingRatio);
        if ($scope.dangerToWellBeingRatio < 0.4) {
            $scope.wellBeing = 'good';
            console.log('good');
        } else
        if ($scope.dangerToWellBeingRatio < 1) {
            $scope.wellBeing = 'caution';
            console.log('caution');
        } else
        if ($scope.dangerToWellBeingRatio < 1.7) {
            $scope.wellBeing = 'danger';
            console.log('danger');
            //showAlert('Slow Down');

        } else {
            $scope.wellBeing = 'stop';
            console.log('stop');
            showAlert('Stop Exercising');
        }


*/
        
    }
    
    // Approximates the current velocity of the user
    // function getCurrentWalkingVelocity() {
    //     if (isUserMoving()) {
    //         if (!$scope.isAlreadyWalking) {
    //             // The user has just started walking, store initial x and z directions
    //             $scope.isXNegative = $scope.accelerometer.X < 0;
    //             $scope.isZNegative = $scope.accelerometer.Z < 0;
    //             $scope.isAlreadyWalking = true;
    //         }

    //         // Find overall acceleration in x and z directions (ie. not the 'up-down' direction)
    //         // Assumes the phone is upright in the pocket
    //         // overall acceleration = sqrt(x^2 + z^2)
    //         var overallAcceleration = Math.sqrt($scope.accelerometer.X * $scope.accelerometer.X +
    //             $scope.accelerometer.Z * $scope.accelerometer.Z);
    //         console.log('current acceleration', overallAcceleration);

    //         // Is the user speeding up or slowing down compared to initial direction?
    //         var direction = -1; // initialise as opposite direction

    //         if ($scope.isXNegative == ($scope.accelerometer.X < 0) && $scope.isZNegative == ($scope.accelerometer.Z < 0)) {
    //             // same direction
    //             direction = 1;
    //         }
    //         console.log('direction', direction);
    //         // velocity = initial velocity + acceleration * time
    //         $scope.currentWalkingVelocity = $scope.currentWalkingVelocity +
    //             direction * overallAcceleration * (options.frequency / 1000);

    //         // $scope.currentWalkingVelocity = overallAcceleration * (options.frequency / 1000);

    //         return $scope.currentWalkingVelocity;

    //     } else {
    //         return $scope.currentWalkingVelocity; // user has not sped up
    //     }


    // }





    function getCurrentWalkingVelocity() {
        if (isUserMoving()) {
            if (!$scope.isAlreadyWalking) {
                // The user has just started walking, store initial x and z directions
                $scope.isXNegative = $scope.accelerometer.X < 0;
                $scope.isZNegative = $scope.accelerometer.Z < 0;
                $scope.isAlreadyWalking = true;
            }
            
            // Find overall acceleration in x and z directions (ie. not the 'up-down' direction), 
            // assumes the phone is vertical in the pocket
            // overall acceleration = sqrt(x^2 + z^2)
            var overallAcceleration = Math.sqrt($scope.accelerometer.X * $scope.accelerometer.X + 
                $scope.accelerometer.Z * $scope.accelerometer.Z);
                
            // Is the user speeding up or slowing down compared to initial direction?
            var direction =  -1; // initialise as opposite direction
            
            if ($scope.isXNegative == ($scope.accelerometer.X < 0) && $scope.isZNegative == ($scope.accelerometer.Z < 0)) {
                direction = 1; // same direction
            }

            // velocity = initial velocity + acceleration * time
            $scope.currentWalkingVelocity = $scope.currentWalkingVelocity + 
                direction * overallAcceleration * (options.frequency / 1000);
                
            return $scope.currentWalkingVelocity;
        
        } else {
            return $scope.currentWalkingVelocity; // user has not sped up
        }
    }

    // Approximates the current stepping velocity of the user
    function getCurrentSteppingVelocity() {
        // determine if the user is moving
        if (isUserMoving()) {
            // determine if user is stepping downward
            if ($scope.accelerometer.Y > GRAVITY) {
                // Downward stepping velocity can be found using acceleration in the y direction
                // velocity = initial velocity + acceleration * time
                $scope.currentSteppingVelocity = $scope.currentSteppingVelocity +
                    ($scope.accelerometer.Y - GRAVITY) * (options.frequency / 1000);
            } else {
                // User is stepping upward, reset stepping velocity
                $scope.currentSteppingVelocity = 0;
                
                // Check if pedometer can count steps
                pedometer.isStepCountingAvailable(function(){
                    // It can count steps, do nothing
                }, function(){
                    // Increase step count manually
                    $scope.pedometer.steps++;
                });
            }

            return $scope.currentSteppingVelocity;

        } else {
            return  $scope.currentSteppingVelocity; // user is not moving, use last stepping velocity until next step is made
        }
    }


    // function getCurrentSteppingVelocity() {
    //     // determine if the user is moving
    //     //if (isUserMoving()) {
    //     // determine if user is stepping downward
    //     if ($scope.accelerometer.Y > GRAVITY) {
    //         // Downward stepping velocity can be found using acceleration in the y direction
    //         // velocity = initial velocity + acceleration * time
    //         // $scope.currentSteppingVelocity = $scope.currentSteppingVelocity +
    //         //     ($scope.accelerometer.Y - GRAVITY) * (options.frequency / 1000);
    //         $scope.currentSteppingVelocity =
    //             ($scope.accelerometer.Y - GRAVITY) * (options.frequency / 1000);
    //     } else {
    //         // User is stepping upward, reset stepping velocity
    //         $scope.currentSteppingVelocity = 0;
    //     }


    //     return $scope.currentSteppingVelocity;

    //     // } else {
    //     //     return $scope.currentSteppingVelocity; // user is not moving, use last stepping velocity until next step is made
    //     // }

    // }

    // determine if the user is moving
    function isUserMoving() {
        // find overall acceleration and see if this is more than gravity alone
        var totalAcceleration = Math.sqrt(Math.pow($scope.accelerometer.X, 2) + Math.pow($scope.accelerometer.Y, 2) + 
            Math.pow($scope.accelerometer.Z, 2));
            
        return totalAcceleration > GRAVITY + ACCELEROMETER_SENSITIVITY; // accelerometer is not perfect
    }
    
    function showAlertIfInDanger() {       
        if ($scope.dangerToWellBeingRatio < 0.4) {
			// Safe
            $scope.wellBeingStatus = "Safe";
		} else if ($scope.dangerToWellBeingRatio < 1) {
			// Caution
            $scope.wellBeingStatus = "Caution";
		} else if ($scope.dangerToWellBeingRatio < 1.7) { 
			// Danger
            $scope.wellBeingStatus = "Danger";
            showAlert("Your exercise is endangering your well-being. Consider taking a break.", "Danger");
		} else {
			// Stop exercising immediately
            $scope.wellBeingStatus = "Stop!!!";
            showAlert("You should stop exercise immediately before you hurt yourself", "Stop Immediately!");
		}
    }
    
});
