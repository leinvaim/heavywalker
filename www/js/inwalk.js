angular.module('starter')

.controller('InWalkCtrl', function($scope, $ionicModal, $state, $rootScope, $http, $cordovaDeviceMotion, $ionicPlatform,
    pedometerService, goalService) {
    $scope.user = JSON.parse(window.localStorage.userID);
    $scope.isPaused = false;
    $scope.isStarted = true;

    $scope.accelerometer = {};
    $scope.pedometer = {};
    var watch = null;
    var options = {
        frequency: 500
    };

    $scope.currentWalkingVelocity = 0; // m/s
    $scope.currentSteppingVelocity = 0; // m/s
    $scope.dangerToWellBeingRatio = 0;
    $scope.isXNegative = false;
    $scope.isZNegative = false;
    $scope.isAlreadyWalking = false;

    var GRAVITY = 9.8; // m/s^2


    // document.addEventListener("deviceready", function() {
    //     console.log('current');
    //     console.log('cordova device motion', $cordovaDeviceMotion);
    //     console.log('navigator', navigator.accelerometer);
    //     $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
    //         console.log('current accel');
    //         $scope.accelerometer.X = result.x;
    //         $scope.accelerometer.Y = result.y;
    //         $scope.accelerometer.Z = result.z;
    //         $scope.accelerometer.timeStamp = result.timestamp;
    //     }, function(err) {
    //         // An error occurred. Show a message to the user
    //     });

    // }, false);


    var urlGet = 'http://heavywalkersapi.esy.es/getLatestAlgorithmValues';
    $http.get(urlGet).then(function(response) {
        $scope.algorithmValues = response.data;
    });

    $scope.pause = function() {
        $scope.isPaused = true;
        $scope.isStarted = false;
        watch.clearWatch();
        watch = null;

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
        console.log('start monitor');
        watch = $cordovaDeviceMotion.watchAcceleration(options);
        console.log('watch created');
        document.addEventListener("deviceready", function() {
            // console.log('pedometer', pedometer);
            console.log('device ready monitor');
            console.log('watch is', watch);
            watch.then(
                function(something) {
                    console.log('something', something);
                },
                function(error) {
                    // An error occurred
                    console.log('error', error);
                },
                function(result) {
                    console.log('result');
                    console.log('Orientation is ' + screen.orientation);
                    $scope.accelerometer.X = result.x;
                    $scope.accelerometer.Y = result.y;
                    $scope.accelerometer.Z = result.z;
                    $scope.accelerometer.timeStamp = result.timestamp;
                    console.log('monitor', $scope.accelerometer);
                    // if(result.x > 6){
                    //     showAlert();
                    // }

                    updateWellbeing();
                });
            // watch.clearWatch();
            // // OR
            // $cordovaDeviceMotion.clearWatch(watch)
            //     .then(function(result) {
            //         // success
            //     }, function(error) {
            //         // error
            //     });

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
    function showAlert(message) {
        if (!isAlert) {
            navigator.notification.alert(
                message, // message
                alertDismissed, // callback
                'Warning', // title
                'OK' // buttonName
            );
        }
        isAlert = true;
        navigator.notification.beep(3);
        navigator.notification.vibrate(1000);

        //navigator.notification.vibrate([1000, 500, 1000, 500, 1000]);
    }

    //$scope.showAlert = showAlert;

    // Updates the danger to well-being ratio of a user
    function updateWellbeing() {
        // Get user BMI based upon weight and height, BMI = weight(kg) / height(m)^2
        // TODO replace with actual logged in user details, hardcoded for testing
        var userBMI = $scope.user.weight / ($scope.user.height * $scope.user.height * 0.0001);
        console.log('BMI', userBMI);
        /* dangerToWellBeingRatio = (userBMI / criticalBMI) * 
                                    (userWalkingSpeed / criticalWalkingSpeed) *
                                    (userSteppingVelocity / criticalSteppingVelocity);
         */

        // Get critical walking speed based on user BMI
        var thisCriticalWalkingSpeed = userBMI > $scope.algorithmValues.critical_bmi ?
            $scope.algorithmValues.critical_walking_speed_obese :
            $scope.algorithmValues.critical_walking_speed_healthy;

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




    }


    // function getCurrentSpeed() {
    //     if(isUserMoving()){

    //     }
    // }
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
     
        if (!$scope.isAlreadyWalking) {
            // The user has just started walking, store initial x and z directions
            $scope.isXNegative = $scope.accelerometer.X < 0;
            $scope.isZNegative = $scope.accelerometer.Z < 0;
            $scope.isAlreadyWalking = true;
        }

        // Find overall acceleration in x and z directions (ie. not the 'up-down' direction)
        // Assumes the phone is upright in the pocket
        // overall acceleration = sqrt(x^2 + z^2)
        var overallAcceleration = Math.sqrt($scope.accelerometer.X * $scope.accelerometer.X +
            $scope.accelerometer.Z * $scope.accelerometer.Z);
        console.log('current acceleration', overallAcceleration);

        // Is the user speeding up or slowing down compared to initial direction?
        var direction = -1; // initialise as opposite direction

        if ($scope.isXNegative == ($scope.accelerometer.X < 0) && $scope.isZNegative == ($scope.accelerometer.Z < 0)) {
            // same direction
            direction = 1;
        }
        console.log('direction', direction);
    
        $scope.currentWalkingVelocity = overallAcceleration * (options.frequency / 1000);

        return $scope.currentWalkingVelocity;
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
            }


            return $scope.currentSteppingVelocity;

        } else {
            return $scope.currentSteppingVelocity; // user is not moving, use last stepping velocity until next step is made
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
        console.log('total acceleration', totalAcceleration);
        return totalAcceleration > GRAVITY + 0.2; // add 0.2 to allow some error, accelerometer is not perfect
    }

});
