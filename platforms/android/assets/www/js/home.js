angular.module('starter')

.controller('HomeCtrl', function($scope, $ionicModal, $state, $rootScope, goalService, pedometerService) {
    $scope.user = JSON.parse(window.localStorage.userID);
    $scope.startWalking = function() {
        $state.go('sideMenu.inwalk');
    }
    $scope.pedometer = {};
    $scope.goal = {};


    $scope.pedometer = pedometerService;
    $scope.goal = goalService;

});
