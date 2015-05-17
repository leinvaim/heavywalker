angular.module('starter')

.controller('InWalkCtrl', function($scope, $ionicModal, $state, $rootScope) {
    $scope.isPaused = false;
    $scope.isStarted = true;

    $scope.pause = function() {
        $scope.isPaused = true;
        $scope.isStarted = false;
    }
    $scope.start = function() {
        $scope.isPaused = false;
        $scope.isStarted = true;

    }
    $scope.wellBeing = 'good';

});
