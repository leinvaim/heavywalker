angular.module('starter')

.controller('InWalkCtrl', function($scope, $ionicModal, $state, $rootScope, $http, $cordovaDeviceMotion) {
    $scope.isPaused = false;
    $scope.isStarted = true;
    $scope.accelerometer = {};
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


    var urlGet = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fheavywalkersapi.esy.es%2FgetLatestAlgorithmValues';
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


    startMonitor();

    function startMonitor() {
        console.log('start monitor');
        watch = $cordovaDeviceMotion.watchAcceleration(options);
        console.log('watch created');
        document.addEventListener("deviceready", function() {
            console.log('device ready monitor');
            console.log('watch is', watch)
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

});
