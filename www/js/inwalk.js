angular.module('starter')

.controller('InWalkCtrl', function($scope, $ionicModal, $state, $rootScope, $http, $cordovaDeviceMotion, $ionicPlatform,
    pedometerService, goalService) {
    $scope.isPaused = false;
    $scope.isStarted = true;
    $scope.accelerometer = {};
    $scope.pedometer = {};
    $scope.wellBeing = 'good';
    var watch = null;
    var options = {
        frequency: 1000
    };


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

    }
    $scope.start = function() {
        $scope.isPaused = false;
        $scope.isStarted = true;
        startMonitor();
    }


    pedometerService.startUpdates();


    $scope.pedometer = pedometerService;
    $scope.goal = goalService;
    /***********************************
     * Pedometer
     * Use different ondeviceready - ionic version
     * return number of steps.
     *************************************/
    // $ionicPlatform.ready(function() {
    //         console.log('running');
    //         console.log('pedometer', pedometer);
    //         var successHandler = function() {
    //             console.log('it works');
    //             pedometer.startPedometerUpdates(function(data) {
    //                 $scope.pedometer.steps = data.numberOfSteps;
    //             }, function(){
    //                 console.log('no data');
    //             });
    //         };
    //         var failureCallback = function() {
    //             console.log('error');
    //         };
    //         pedometer.isStepCountingAvailable(successHandler, failureCallback);
    //     });


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
                null,
                function(error) {
                    // An error occurred
                    console.log('error error');
                },
                function(result) {
                    console.log('result');
                    $scope.accelerometer.X = result.x;
                    $scope.accelerometer.Y = result.y;
                    $scope.accelerometer.Z = result.z;
                    $scope.accelerometer.timeStamp = result.timestamp;
                    console.log('monitor', $scope.accelerometer);
                    // if(result.x > 6){
                    //     showAlert();
                    // }
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

    function alertDismissed() {
        // do something
    }

    // Show a custom alertDismissed
    //
    function showAlert() {
        navigator.notification.alert(
            'Slow down!', // message
            alertDismissed, // callback
            'Warning', // title
            'OK' // buttonName
        );
        navigator.notification.beep(3);
        navigator.notification.vibrate(4000);
        //navigator.notification.vibrate([1000, 500, 1000, 500, 1000]);
    }

    $scope.showAlert = showAlert;
});
