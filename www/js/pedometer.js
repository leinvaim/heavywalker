angular.module('starter')
    .factory('pedometerService', function($ionicPlatform, $rootScope) {

        var service = {
            startUpdates: startUpdates,
            steps: 0
        };
        return service;

        var started = false;

        function startUpdates(stepResults) {
            console.log('inside function');

            if (started) {
                return;
            }

            $ionicPlatform.ready(function() {
                console.log('running');
                console.log('pedometer', pedometer);
                var successHandler = function() {
                    console.log('it works');
                    pedometer.startPedometerUpdates(function(data) {
                        $rootScope.$apply(function() {
                            started = true;
                            service.steps = data.numberOfSteps;
                            console.log('steps', service.steps);
                        });
                    }, function() {
                        console.log('no data');
                    });
                };
                var failureCallback = function() {
                    console.log('error no pedometer');
                };
                pedometer.isStepCountingAvailable(successHandler, failureCallback);
            });
        }

    });
