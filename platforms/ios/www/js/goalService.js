angular.module('starter')
    .factory('goalService', function($ionicPlatform, $rootScope) {

        var service = {
            getGoal: getGoal,
            setGoal: setGoal,
            currentGoal: 1000
        };
        return service;


        function getGoal() {
            console.log('hello world');
            return service.currentGoal;
        }

        function setGoal(newGoal) {
            service.currentGoal = newGoal;
        }

      
    });
