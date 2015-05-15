angular.module('starter')

.controller('HomeCtrl', function($scope, $ionicModal, $state, $rootScope) {
    $scope.user = JSON.parse(window.localStorage.userID);
    $scope.startWalking = function() {
        $state.go('sideMenu.inwalk');
    }

    $scope.progress = 90;

});
