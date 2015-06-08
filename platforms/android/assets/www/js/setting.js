angular.module('starter')

.controller('SettingCtrl', function($scope, $ionicModal, $state, $rootScope) {
    $scope.user = JSON.parse(window.localStorage.userID);

});
