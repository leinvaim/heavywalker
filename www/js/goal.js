angular.module('starter')

.controller('GoalCtrl', function($scope, $ionicModal, $state, $rootScope) {
    $scope.user = JSON.parse(window.localStorage.userID);

});
