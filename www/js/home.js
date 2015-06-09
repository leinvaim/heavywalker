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
    $rootScope.progress = {};
    $rootScope.progress.progress = $scope.pedometer.steps / $scope.goal.currentGoal * 100 || 0;
    //$scope.progress = 0;
    // $scope.moreProgress = function() {
    //     $scope.progress++;
    // }

});
